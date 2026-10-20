import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { servicesApi } from '@/src/services/api/endpoints/services';
import { providerApi } from '@/src/services/api/endpoints/provider';
import { InlineVariationRow } from './VariationRowEditor';
import { Colors, FontSize, FontWeight, Radii } from '@/src/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const COMMON_ICONS = [
  { icon: 'construct-outline', label: 'General', mc: 'tools' },
  { icon: 'flash-outline', label: 'Electrical', mc: 'lightning-bolt' },
  { icon: 'water-outline', label: 'Plumbing', mc: 'pipe-wrench' },
  { icon: 'snow-outline', label: 'AC / HVAC', mc: 'air-conditioner' },
  { icon: 'sparkles-outline', label: 'Cleaning', mc: 'spray-bottle' },
  { icon: 'hammer-outline', label: 'Carpentry', mc: 'hammer' },
];

interface OptionItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  meta?: string;
  data?: any;
}

interface OptionPickerModalProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  options: OptionItem[];
  selectedId: string | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onSelect: (item: OptionItem) => void;
  onClose: () => void;
}

/**
 * Reusable modal picker for predefined Catalog Services & Variations
 */
const OptionPickerModal: React.FC<OptionPickerModalProps> = ({
  visible,
  title,
  subtitle,
  options,
  selectedId,
  loading = false,
  error = null,
  onRetry,
  onSelect,
  onClose,
}) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!visible) setSearch('');
  }, [visible]);

  const filtered = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        (o.subtitle && o.subtitle.toLowerCase().includes(q))
    );
  }, [options, search]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={s.pickerOverlay}>
        <TouchableOpacity
          style={s.pickerBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <SafeAreaView edges={['bottom']} style={s.pickerSheetContainer}>
          {/* Header */}
          <View style={s.pickerHeader}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={s.pickerHeaderTitle}>{title}</Text>
              {subtitle ? (
                <Text style={s.pickerHeaderSub}>{subtitle}</Text>
              ) : null}
            </View>
            <TouchableOpacity
              style={s.pickerCloseBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Search Bar if > 3 options */}
          {options.length > 3 ? (
            <View style={s.pickerSearchWrap}>
              <Ionicons
                name="search-outline"
                size={16}
                color="#94A3B8"
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={s.pickerSearchInput}
                placeholder="Filter options..."
                placeholderTextColor="#94A3B8"
                value={search}
                onChangeText={setSearch}
                autoCapitalize="none"
                clearButtonMode="while-editing"
              />
            </View>
          ) : null}

          {/* Body Content */}
          <View style={s.pickerBody}>
            {loading ? (
              <View style={s.pickerLoadingWrap}>
                <ActivityIndicator size="large" color="#6366F1" />
                <Text style={s.pickerLoadingTxt}>Loading available options...</Text>
              </View>
            ) : error ? (
              <View style={s.pickerErrorWrap}>
                <Ionicons name="alert-circle-outline" size={36} color="#DC2626" />
                <Text style={s.pickerErrorTitle}>Failed to load options</Text>
                <Text style={s.pickerErrorSub}>{error}</Text>
                {onRetry ? (
                  <TouchableOpacity
                    style={s.pickerRetryBtn}
                    onPress={onRetry}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="refresh-outline"
                      size={15}
                      color="#FFFFFF"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={s.pickerRetryTxt}>Try Again</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : filtered.length === 0 ? (
              <View style={s.pickerEmptyWrap}>
                <Ionicons name="file-tray-outline" size={36} color="#94A3B8" />
                <Text style={s.pickerEmptyTitle}>No options found</Text>
                <Text style={s.pickerEmptySub}>
                  {search.trim()
                    ? 'No options match your search query.'
                    : 'No predefined offerings found for this selection.'}
                </Text>
              </View>
            ) : (
              <ScrollView
                style={s.pickerScroll}
                contentContainerStyle={s.pickerScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {filtered.map((item) => {
                  const isSelected = selectedId === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        s.pickerItemCard,
                        isSelected && s.pickerItemCardActive,
                      ]}
                      onPress={() => {
                        onSelect(item);
                        onClose();
                      }}
                      activeOpacity={0.75}
                    >
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <View style={s.pickerItemTopRow}>
                          <Text
                            style={[
                              s.pickerItemTitle,
                              isSelected && s.pickerItemTitleActive,
                            ]}
                          >
                            {item.title}
                          </Text>
                          {item.badge ? (
                            <View style={s.pickerBadge}>
                              <Text style={s.pickerBadgeTxt}>{item.badge}</Text>
                            </View>
                          ) : null}
                        </View>
                        {item.subtitle ? (
                          <Text style={s.pickerItemSubtitle} numberOfLines={2}>
                            {item.subtitle}
                          </Text>
                        ) : null}
                        {item.meta ? (
                          <View style={s.pickerMetaRow}>
                            <Ionicons
                              name="time-outline"
                              size={12}
                              color="#6366F1"
                              style={{ marginRight: 4 }}
                            />
                            <Text style={s.pickerMetaTxt}>{item.meta}</Text>
                          </View>
                        ) : null}
                      </View>
                      <Ionicons
                        name={
                          isSelected
                            ? 'checkmark-circle'
                            : 'radio-button-off-outline'
                        }
                        size={22}
                        color={isSelected ? '#6366F1' : '#CBD5E1'}
                      />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export const ServiceFormModal: React.FC<Props> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  // Categories from backend
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Predefined catalog state
  const [catalogServices, setCatalogServices] = useState<any[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  // Form selections & fields
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [selectedVariationLabel, setSelectedVariationLabel] = useState<string | null>(null);
  const [shortDesc, setShortDesc] = useState('');
  const [price, setPrice] = useState('');
  const [eta, setEta] = useState('45 mins');
  const [selectedIcon, setSelectedIcon] = useState('tools');
  const [variations, setVariations] = useState<InlineVariationRow[]>([]);

  // Picker modal state
  const [servicePickerVisible, setServicePickerVisible] = useState(false);
  const [variationPickerVisible, setVariationPickerVisible] = useState(false);

  // Request & error state
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Load backend categories on modal open
  useEffect(() => {
    let mounted = true;
    servicesApi
      .listCategories()
      .then((cats) => {
        if (mounted && Array.isArray(cats) && cats.length > 0) {
          const mapped = cats.map((c: any) => ({
            id: c._id || c.id,
            name: c.name,
          }));
          setCategories(mapped);
          if (!selectedCategory) {
            setSelectedCategory(mapped[0].id);
          }
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [visible]);

  // 2. Load catalog items whenever selected category changes
  const loadCatalog = useCallback(async (catId: string) => {
    if (!catId) return;
    setLoadingCatalog(true);
    setCatalogError(null);
    try {
      const items = await providerApi.getCatalog(catId);
      setCatalogServices(items);
    } catch (err: any) {
      setCatalogError('Could not load predefined catalog services. Please retry.');
    } finally {
      setLoadingCatalog(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCategory && visible) {
      loadCatalog(selectedCategory);
    }
  }, [selectedCategory, visible, loadCatalog]);

  // Handle category change: reset service and variation
  const handleSelectCategory = (catId: string) => {
    if (catId === selectedCategory) return;
    setSelectedCategory(catId);
    setSelectedServiceId(null);
    setName('');
    setSelectedVariationLabel(null);
    setVariations([]);
  };

  // Currently selected service object
  const selectedServiceObj = useMemo(() => {
    if (!selectedServiceId) return null;
    return catalogServices.find((s) => s._id === selectedServiceId || s.name === name) || null;
  }, [catalogServices, selectedServiceId, name]);

  // Options for Service Name dropdown
  const serviceOptions: OptionItem[] = useMemo(() => {
    return catalogServices.map((svc) => ({
      id: svc._id,
      title: svc.name,
      subtitle: svc.description,
      badge: `From ₹${svc.defaultPrice}`,
      meta: svc.defaultEta,
      data: svc,
    }));
  }, [catalogServices]);

  // Options for Variation dropdown (belongs to chosen service)
  const variationOptions: OptionItem[] = useMemo(() => {
    if (!selectedServiceObj || !Array.isArray(selectedServiceObj.variations)) return [];
    return selectedServiceObj.variations.map((v: any, index: number) => ({
      id: `${index}-${v.label}`,
      title: v.label,
      subtitle: v.desc,
      badge: `₹${v.defaultPrice || selectedServiceObj.defaultPrice}`,
      meta: v.duration || '45 mins',
      data: v,
    }));
  }, [selectedServiceObj]);

  // When user picks a Service Name
  const handleSelectService = (option: OptionItem) => {
    const svc = option.data;
    setSelectedServiceId(svc._id);
    setName(svc.name);

    // Dependent Variation dropdown resets when Service Name changes
    setSelectedVariationLabel(null);
    setVariations([]);

    // Pre-fill optional defaults
    if (svc.description && !shortDesc.trim()) {
      setShortDesc(svc.description);
    }
    if (svc.defaultPrice && !price.trim()) {
      setPrice(String(svc.defaultPrice));
    }
    if (svc.defaultEta) {
      setEta(svc.defaultEta);
    }
    if (svc.mcIcon) {
      setSelectedIcon(svc.mcIcon);
    }
  };

  // When user picks a Variation
  const handleSelectVariation = (option: OptionItem) => {
    const v = option.data;
    setSelectedVariationLabel(v.label);

    const vPrice = v.defaultPrice ? String(v.defaultPrice) : price || '299';
    const vDuration = v.duration || eta || '45 mins';
    const vDesc = v.desc || shortDesc || 'Standard package';

    // Populate variation row
    setVariations([
      {
        id: '1',
        label: v.label,
        desc: vDesc,
        price: vPrice,
        duration: vDuration,
      },
    ]);

    // Pre-fill base price if empty
    if (!price.trim()) {
      setPrice(vPrice);
    }
    if (v.duration) {
      setEta(vDuration);
    }
  };

  // Check if form is dirty
  const isDirty =
    Boolean(name.trim()) ||
    Boolean(shortDesc.trim()) ||
    Boolean(price.trim()) ||
    Boolean(selectedVariationLabel) ||
    variations.length > 0;

  const resetForm = () => {
    setSelectedServiceId(null);
    setName('');
    setSelectedVariationLabel(null);
    setShortDesc('');
    setPrice('');
    setEta('45 mins');
    setSelectedIcon('tools');
    setVariations([]);
    setErrorMsg(null);
  };

  const handleAttemptClose = () => {
    if (isDirty) {
      Alert.alert(
        'Discard Unsaved Changes?',
        'You have unsaved changes in your service form. Are you sure you want to close?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              resetForm();
              onClose();
            },
          },
        ]
      );
    } else {
      resetForm();
      onClose();
    }
  };

  const validate = (): string | null => {
    if (!selectedCategory) return 'Please select a service category.';
    if (!name.trim()) return 'Please select a predefined Service Name.';
    if (!selectedVariationLabel) return 'Please select a Variation tier for this service.';
    if (!shortDesc.trim()) return 'Service description is required.';
    if (shortDesc.trim().length > 500) return 'Description cannot exceed 500 characters.';
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) return 'Price must be a valid positive number.';
    if (!eta.trim()) return 'Turnaround ETA is required (e.g. 45 mins).';

    for (let i = 0; i < variations.length; i++) {
      const v = variations[i];
      if (!v.label.trim()) return `Variation #${i + 1} requires a title.`;
      const vPrice = Number(v.price);
      if (isNaN(vPrice) || vPrice <= 0) return `Variation #${i + 1} requires a valid positive price.`;
    }

    return null;
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setSaving(true);
    try {
      const selectedCatObj = categories.find((c) => c.id === selectedCategory);
      const categoryLabel = selectedCatObj ? selectedCatObj.name : 'General';

      // 1. Create main service
      const createdService = await providerApi.createService({
        categoryId: selectedCategory,
        name: name.trim(),
        shortDesc: shortDesc.trim(),
        price: Number(price),
        eta: eta.trim(),
        mcIcon: selectedIcon,
        categoryLabel,
        accentColor: '#6366F1',
        accentBg: '#EEF2FF',
      });

      // 2. Create variations if attached
      const serviceId = createdService?._id || createdService?.id;
      if (serviceId && variations.length > 0) {
        for (const v of variations) {
          await providerApi.createVariation(serviceId, {
            label: v.label.trim(),
            desc: v.desc.trim() || 'Standard package',
            price: Number(v.price),
            duration: v.duration.trim() || '45 mins',
            mcIcon: selectedIcon,
            popular: false,
          });
        }
      }

      Alert.alert('Success', 'Service created successfully and published!');
      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err?.message || 'Failed to save service. Please check your connection.';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleAttemptClose}
    >
      <View style={s.modalOverlay}>
        <TouchableOpacity
          style={s.backdropDismiss}
          activeOpacity={1}
          onPress={handleAttemptClose}
        />

        <SafeAreaView edges={['bottom']} style={s.sheetContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={s.keyboardView}
          >
            {/* Header */}
            <View style={s.sheetHeader}>
              <View>
                <Text style={s.headerTitle}>Add New Service</Text>
                <Text style={s.headerSub}>Publish a standardized service offering</Text>
              </View>
              <TouchableOpacity
                style={s.closeBtn}
                onPress={handleAttemptClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {errorMsg ? (
              <View style={s.errorBanner}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                <Text style={s.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            <ScrollView
              style={s.scrollArea}
              contentContainerStyle={s.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Category Picker */}
              <View style={s.fieldGroup}>
                <Text style={s.label}>Category *</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={s.chipScroll}
                >
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[s.categoryChip, isSelected && s.categoryChipActive]}
                        onPress={() => handleSelectCategory(cat.id)}
                        activeOpacity={0.75}
                      >
                        <Text
                          style={[
                            s.categoryChipTxt,
                            isSelected && s.categoryChipTxtActive,
                          ]}
                        >
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Service Name Dropdown */}
              <View style={s.fieldGroup}>
                <View style={s.fieldHeaderRow}>
                  <Text style={s.label}>Service Name *</Text>
                  {catalogServices.length > 0 ? (
                    <Text style={s.fieldCounter}>
                      {catalogServices.length} options available
                    </Text>
                  ) : null}
                </View>

                {catalogError ? (
                  <View style={s.fieldInlineError}>
                    <Text style={s.fieldInlineErrorTxt}>{catalogError}</Text>
                    <TouchableOpacity
                      style={s.fieldRetryBtn}
                      onPress={() => loadCatalog(selectedCategory)}
                    >
                      <Ionicons name="refresh" size={12} color="#FFFFFF" />
                      <Text style={s.fieldRetryTxt}>Retry</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[
                      s.dropdownTrigger,
                      Boolean(name) && s.dropdownTriggerSelected,
                      loadingCatalog && s.dropdownTriggerLoading,
                    ]}
                    onPress={() => setServicePickerVisible(true)}
                    activeOpacity={0.8}
                    disabled={loadingCatalog || saving}
                  >
                    <View style={s.dropdownLeft}>
                      <Ionicons
                        name="briefcase-outline"
                        size={17}
                        color={name ? '#4F46E5' : '#94A3B8'}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={[
                          s.dropdownText,
                          Boolean(name) && s.dropdownTextSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {loadingCatalog
                          ? 'Loading catalog services...'
                          : name || 'Select predefined service offering...'}
                      </Text>
                    </View>
                    {loadingCatalog ? (
                      <ActivityIndicator size="small" color="#6366F1" />
                    ) : (
                      <Ionicons name="chevron-down" size={17} color="#64748B" />
                    )}
                  </TouchableOpacity>
                )}
              </View>

              {/* Dependent Variation Dropdown */}
              <View style={s.fieldGroup}>
                <View style={s.fieldHeaderRow}>
                  <Text style={s.label}>Variation Tier *</Text>
                  {selectedServiceId && variationOptions.length > 0 ? (
                    <Text style={s.fieldCounter}>
                      {variationOptions.length} tiers for this service
                    </Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  style={[
                    s.dropdownTrigger,
                    !selectedServiceId && s.dropdownTriggerDisabled,
                    Boolean(selectedVariationLabel) && s.dropdownTriggerSelected,
                  ]}
                  onPress={() => setVariationPickerVisible(true)}
                  activeOpacity={0.8}
                  disabled={!selectedServiceId || saving}
                >
                  <View style={s.dropdownLeft}>
                    <Ionicons
                      name="layers-outline"
                      size={17}
                      color={selectedVariationLabel ? '#4F46E5' : '#94A3B8'}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={[
                        s.dropdownText,
                        !selectedServiceId && s.dropdownTextDisabled,
                        Boolean(selectedVariationLabel) && s.dropdownTextSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {!selectedServiceId
                        ? 'Select a service name first'
                        : selectedVariationLabel || 'Select variation tier...'}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-down"
                    size={17}
                    color={!selectedServiceId ? '#CBD5E1' : '#64748B'}
                  />
                </TouchableOpacity>
              </View>

              {/* Price & Turnaround ETA (Manual & Pre-filled) */}
              <View style={s.gridRow}>
                <View style={s.gridCol}>
                  <Text style={s.label}>Base Price (₹) *</Text>
                  <TextInput
                    style={s.input}
                    placeholder="e.g. 299"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                    editable={!saving}
                  />
                </View>

                <View style={s.gridCol}>
                  <Text style={s.label}>Turnaround ETA *</Text>
                  <TextInput
                    style={s.input}
                    placeholder="e.g. 30-45 mins"
                    placeholderTextColor="#94A3B8"
                    value={eta}
                    onChangeText={setEta}
                    editable={!saving}
                  />
                </View>
              </View>

              {/* Description (Manual & Pre-filled) */}
              <View style={s.fieldGroup}>
                <Text style={s.label}>Description *</Text>
                <TextInput
                  style={[s.input, s.textArea]}
                  placeholder="Outline what is included in this service offering..."
                  placeholderTextColor="#94A3B8"
                  value={shortDesc}
                  onChangeText={setShortDesc}
                  multiline
                  numberOfLines={3}
                  editable={!saving}
                />
              </View>

              {/* Icon Selector */}
              <View style={s.fieldGroup}>
                <Text style={s.label}>Service Icon</Text>
                <View style={s.iconRow}>
                  {COMMON_ICONS.map((item) => {
                    const isSelected = selectedIcon === item.mc;
                    return (
                      <TouchableOpacity
                        key={item.mc}
                        style={[s.iconBox, isSelected && s.iconBoxActive]}
                        onPress={() => setSelectedIcon(item.mc)}
                        activeOpacity={0.75}
                      >
                        <Ionicons
                          name={item.icon as any}
                          size={18}
                          color={isSelected ? '#4F46E5' : '#64748B'}
                        />
                        <Text
                          style={[s.iconLabel, isSelected && s.iconLabelActive]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            {/* Bottom Actions */}
            <View style={s.sheetFooter}>
              <TouchableOpacity
                style={s.cancelBtn}
                onPress={handleAttemptClose}
                disabled={saving}
                activeOpacity={0.75}
              >
                <Text style={s.cancelBtnTxt}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.submitBtn, saving && s.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={saving}
                activeOpacity={0.85}
              >
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={s.submitBtnTxt}>Save & Publish Service</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>

        {/* Modal Pickers */}
        <OptionPickerModal
          visible={servicePickerVisible}
          title="Select Service Name"
          subtitle="Choose from predefined standard offerings"
          options={serviceOptions}
          selectedId={selectedServiceId}
          loading={loadingCatalog}
          error={catalogError}
          onRetry={() => loadCatalog(selectedCategory)}
          onSelect={handleSelectService}
          onClose={() => setServicePickerVisible(false)}
        />

        <OptionPickerModal
          visible={variationPickerVisible}
          title="Select Variation Tier"
          subtitle={name ? `Options for ${name}` : 'Select a variation package'}
          options={variationOptions}
          selectedId={selectedVariationLabel ? `selected-${selectedVariationLabel}` : null}
          onSelect={handleSelectVariation}
          onClose={() => setVariationPickerVisible(false)}
        />
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  backdropDismiss: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  keyboardView: {
    maxHeight: '100%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
    flex: 1,
  },
  scrollArea: {
    paddingHorizontal: 20,
    maxHeight: 480,
  },
  scrollContent: {
    paddingTop: 14,
    paddingBottom: 16,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldCounter: {
    fontSize: 11,
    color: '#6366F1',
    fontWeight: '600',
  },
  fieldInlineError: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  fieldInlineErrorTxt: {
    fontSize: 12,
    color: '#DC2626',
    flex: 1,
    marginRight: 8,
  },
  fieldRetryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  fieldRetryTxt: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  gridCol: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  dropdownTriggerSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  dropdownTriggerLoading: {
    opacity: 0.75,
  },
  dropdownTriggerDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.6,
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  dropdownText: {
    fontSize: 13,
    color: '#94A3B8',
    flex: 1,
  },
  dropdownTextSelected: {
    color: '#0F172A',
    fontWeight: '600',
  },
  dropdownTextDisabled: {
    color: '#94A3B8',
  },
  chipScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  categoryChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  categoryChipTxt: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  categoryChipTxtActive: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 6,
  },
  iconBoxActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  iconLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  iconLabelActive: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  sheetFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  cancelBtnTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  submitBtn: {
    flex: 1,
    backgroundColor: '#6366F1',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnDisabled: {
    opacity: 0.65,
  },
  submitBtnTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── OptionPickerModal Styles ───────────────────────────────────────────────
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  pickerBackdrop: {
    flex: 1,
  },
  pickerSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    minHeight: 340,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pickerHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  pickerHeaderSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  pickerCloseBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  pickerSearchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pickerSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },
  pickerBody: {
    flex: 1,
  },
  pickerLoadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    gap: 12,
  },
  pickerLoadingTxt: {
    fontSize: 13,
    color: '#64748B',
  },
  pickerErrorWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 8,
  },
  pickerErrorTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  pickerErrorSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  pickerRetryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  pickerRetryTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pickerEmptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 6,
  },
  pickerEmptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  pickerEmptySub: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  pickerScroll: {
    paddingHorizontal: 20,
  },
  pickerScrollContent: {
    paddingTop: 8,
    paddingBottom: 20,
    gap: 8,
  },
  pickerItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  pickerItemCardActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  pickerItemTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  pickerItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  pickerItemTitleActive: {
    color: '#4338CA',
  },
  pickerBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pickerBadgeTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  pickerItemSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 16,
  },
  pickerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  pickerMetaTxt: {
    fontSize: 11,
    color: '#6366F1',
    fontWeight: '600',
  },
});

export default ServiceFormModal;
