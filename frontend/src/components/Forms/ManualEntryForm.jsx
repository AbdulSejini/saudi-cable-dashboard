import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import {
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  Thermometer,
  Gauge,
  Package,
  Trash2
} from 'lucide-react';

const ManualEntryForm = ({ type = 'production', machine, onClose, onSubmit }) => {
  const { t, isRTL, language } = useLanguage();
  const { machines, addProductionLog, addScrapEntry, updateMachineStatus } = useData();
  const { isDark, colors } = useTheme();

  const [formData, setFormData] = useState({
    machineId: machine?.id || '',
    shift: 'morning',
    operator: machine?.operator || '',
    timestamp: new Date().toISOString().slice(0, 16),
    // Production fields
    speed: machine?.speed || 0,
    temperature: machine?.temperature || 0,
    output: 0,
    // Downtime fields
    downtimeType: 'mechanical',
    downtimeReason: '',
    duration: 0,
    // Quality fields
    diameter: 0,
    sparkTestPassed: true,
    tensileTestPassed: true,
    // Scrap fields
    scrapType: 'copper-wire',
    scrapWeight: 0,
    copperContent: 0,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const machineOptions = Object.values(machines);

  const shiftOptions = [
    { value: 'morning', label: language === 'ar' ? 'صباحية (06:00 - 14:00)' : 'Morning (06:00 - 14:00)' },
    { value: 'evening', label: language === 'ar' ? 'مسائية (14:00 - 22:00)' : 'Evening (14:00 - 22:00)' },
    { value: 'night', label: language === 'ar' ? 'ليلية (22:00 - 06:00)' : 'Night (22:00 - 06:00)' },
  ];

  const downtimeTypes = [
    { value: 'mechanical', label: language === 'ar' ? 'ميكانيكي' : 'Mechanical' },
    { value: 'electrical', label: language === 'ar' ? 'كهربائي' : 'Electrical' },
    { value: 'material', label: language === 'ar' ? 'انتظار مواد' : 'Material Waiting' },
    { value: 'setup', label: language === 'ar' ? 'إعداد/تغيير' : 'Setup/Changeover' },
    { value: 'quality', label: language === 'ar' ? 'مشكلة جودة' : 'Quality Issue' },
    { value: 'break', label: language === 'ar' ? 'استراحة' : 'Scheduled Break' },
    { value: 'other', label: language === 'ar' ? 'أخرى' : 'Other' },
  ];

  const scrapTypes = [
    { value: 'copper-wire', label: language === 'ar' ? 'سلك نحاس' : 'Copper Wire', copperContent: 93 },
    { value: 'pvc-compound', label: language === 'ar' ? 'مركب PVC' : 'PVC Compound', copperContent: 0 },
    { value: 'mixed-cable', label: language === 'ar' ? 'كابل مختلط' : 'Mixed Cable', copperContent: 45 },
    { value: 'aluminum-wire', label: language === 'ar' ? 'سلك ألمنيوم' : 'Aluminum Wire', copperContent: 0 },
    { value: 'insulated-copper', label: language === 'ar' ? 'نحاس معزول' : 'Insulated Copper', copperContent: 70 },
  ];

  const typeLabels = {
    production: language === 'ar' ? 'إدخال الإنتاج' : 'Production Entry',
    downtime: language === 'ar' ? 'تسجيل التوقف' : 'Downtime Entry',
    quality: language === 'ar' ? 'فحص الجودة' : 'Quality Check',
    scrap: language === 'ar' ? 'إدخال السكراب' : 'Scrap Entry',
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }

    // Auto-calculate copper content for scrap
    if (field === 'scrapType') {
      const scrapItem = scrapTypes.find(s => s.value === value);
      if (scrapItem) {
        setFormData(prev => ({ ...prev, copperContent: scrapItem.copperContent }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.machineId) {
      newErrors.machineId = language === 'ar' ? 'الماكينة مطلوبة' : 'Machine is required';
    }

    if (type === 'production') {
      if (formData.speed < 0) newErrors.speed = language === 'ar' ? 'السرعة يجب أن تكون موجبة' : 'Speed must be positive';
      if (formData.output < 0) newErrors.output = language === 'ar' ? 'الإنتاج يجب أن يكون موجب' : 'Output must be positive';
    }

    if (type === 'downtime') {
      if (formData.duration <= 0) newErrors.duration = language === 'ar' ? 'المدة يجب أن تكون أكبر من صفر' : 'Duration must be greater than 0';
      if (!formData.downtimeReason) newErrors.downtimeReason = language === 'ar' ? 'السبب مطلوب' : 'Reason is required';
    }

    if (type === 'scrap') {
      if (formData.scrapWeight <= 0) newErrors.scrapWeight = language === 'ar' ? 'الوزن يجب أن يكون أكبر من صفر' : 'Weight must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (type === 'production') {
        addProductionLog({
          ...formData,
          type: 'production'
        });
        updateMachineStatus(formData.machineId, {
          speed: formData.speed,
          temperature: formData.temperature
        });
      } else if (type === 'scrap') {
        addScrapEntry({
          ...formData,
          type: 'scrap',
          financialValue: calculateScrapValue()
        });
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        onSubmit?.(formData);
        onClose?.();
      }, 1500);
    } catch (error) {
      setErrors({ submit: language === 'ar' ? 'فشل في الحفظ. حاول مرة أخرى.' : 'Failed to save entry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateScrapValue = () => {
    const lmePrice = 8500; // USD per ton
    const copperWeight = (formData.scrapWeight * formData.copperContent) / 100;
    return ((copperWeight / 1000) * lmePrice).toFixed(2);
  };

  // Styles based on theme
  const modalBgStyle = {
    background: isDark
      ? 'linear-gradient(145deg, #1F2937, #111827)'
      : 'linear-gradient(145deg, #FFFFFF, #F9FAFB)',
    border: `1px solid ${colors.border}`,
    boxShadow: isDark
      ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
  };

  const inputStyle = {
    background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F9FAFB',
    border: `1px solid ${colors.border}`,
    color: colors.textPrimary,
  };

  const inputErrorStyle = {
    ...inputStyle,
    border: '1px solid #EF4444',
  };

  const labelStyle = {
    color: colors.textSecondary,
  };

  const renderFormFields = () => {
    switch (type) {
      case 'production':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                icon={<Gauge className="w-4 h-4" />}
                label={language === 'ar' ? 'السرعة (م/ث)' : 'Speed (m/s)'}
                type="number"
                value={formData.speed}
                onChange={(v) => handleChange('speed', parseFloat(v) || 0)}
                error={errors.speed}
                colors={colors}
                isDark={isDark}
              />
              <InputField
                icon={<Thermometer className="w-4 h-4" />}
                label={language === 'ar' ? 'الحرارة (°C)' : 'Temperature (°C)'}
                type="number"
                value={formData.temperature}
                onChange={(v) => handleChange('temperature', parseFloat(v) || 0)}
                error={errors.temperature}
                colors={colors}
                isDark={isDark}
              />
            </div>
            <InputField
              icon={<Package className="w-4 h-4" />}
              label={language === 'ar' ? 'الإنتاج (متر)' : 'Output (meters)'}
              type="number"
              value={formData.output}
              onChange={(v) => handleChange('output', parseFloat(v) || 0)}
              error={errors.output}
              colors={colors}
              isDark={isDark}
            />
          </>
        );

      case 'downtime':
        return (
          <>
            <SelectField
              label={language === 'ar' ? 'نوع التوقف' : 'Downtime Type'}
              value={formData.downtimeType}
              options={downtimeTypes}
              onChange={(v) => handleChange('downtimeType', v)}
              colors={colors}
              isDark={isDark}
            />
            <InputField
              icon={<Clock className="w-4 h-4" />}
              label={language === 'ar' ? 'المدة (دقيقة)' : 'Duration (minutes)'}
              type="number"
              value={formData.duration}
              onChange={(v) => handleChange('duration', parseInt(v) || 0)}
              error={errors.duration}
              colors={colors}
              isDark={isDark}
            />
            <TextAreaField
              label={language === 'ar' ? 'السبب / الوصف' : 'Reason / Description'}
              value={formData.downtimeReason}
              onChange={(v) => handleChange('downtimeReason', v)}
              error={errors.downtimeReason}
              placeholder={language === 'ar' ? 'اكتب سبب التوقف...' : 'Describe the reason for downtime...'}
              colors={colors}
              isDark={isDark}
            />
          </>
        );

      case 'quality':
        return (
          <>
            <InputField
              icon={<Activity className="w-4 h-4" />}
              label={language === 'ar' ? 'القطر (مم)' : 'Diameter (mm)'}
              type="number"
              step="0.01"
              value={formData.diameter}
              onChange={(v) => handleChange('diameter', parseFloat(v) || 0)}
              colors={colors}
              isDark={isDark}
            />
            <div className="grid grid-cols-2 gap-4">
              <CheckboxField
                label={language === 'ar' ? 'اختبار الشرارة ناجح' : 'Spark Test Passed'}
                checked={formData.sparkTestPassed}
                onChange={(v) => handleChange('sparkTestPassed', v)}
                colors={colors}
                isDark={isDark}
              />
              <CheckboxField
                label={language === 'ar' ? 'اختبار الشد ناجح' : 'Tensile Test Passed'}
                checked={formData.tensileTestPassed}
                onChange={(v) => handleChange('tensileTestPassed', v)}
                colors={colors}
                isDark={isDark}
              />
            </div>
          </>
        );

      case 'scrap':
        return (
          <>
            <SelectField
              label={language === 'ar' ? 'نوع السكراب' : 'Scrap Type'}
              value={formData.scrapType}
              options={scrapTypes.map(s => ({ value: s.value, label: s.label }))}
              onChange={(v) => handleChange('scrapType', v)}
              colors={colors}
              isDark={isDark}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                icon={<Trash2 className="w-4 h-4" />}
                label={language === 'ar' ? 'الوزن (كجم)' : 'Weight (kg)'}
                type="number"
                value={formData.scrapWeight}
                onChange={(v) => handleChange('scrapWeight', parseFloat(v) || 0)}
                error={errors.scrapWeight}
                colors={colors}
                isDark={isDark}
              />
              <InputField
                label={language === 'ar' ? 'نسبة النحاس (%)' : 'Copper Content (%)'}
                type="number"
                value={formData.copperContent}
                onChange={(v) => handleChange('copperContent', parseFloat(v) || 0)}
                colors={colors}
                isDark={isDark}
              />
            </div>
            {formData.scrapWeight > 0 && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  {language === 'ar' ? 'القيمة التقديرية' : 'Estimated Value'}
                </p>
                <p className="text-2xl font-bold text-green-500">${calculateScrapValue()}</p>
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={modalBgStyle}
      >
        {/* Header */}
        <div
          className="p-6"
          style={{
            borderBottom: `1px solid ${colors.border}`,
            background: isDark
              ? 'linear-gradient(135deg, rgba(243, 146, 0, 0.1), transparent)'
              : 'linear-gradient(135deg, rgba(243, 146, 0, 0.08), transparent)',
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
              {typeLabels[type]}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-xl transition-colors"
              style={{ background: colors.bgTertiary }}
            >
              <X className="w-5 h-5" style={{ color: colors.textMuted }} />
            </motion.button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Success Message */}
          <AnimatePresence>
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-xl bg-green-500/15 border border-green-500/30 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-500 font-medium">
                  {language === 'ar' ? 'تم الحفظ بنجاح!' : 'Entry saved successfully!'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-500">{errors.submit}</span>
            </div>
          )}

          {/* Common Fields */}
          <SelectField
            label={language === 'ar' ? 'الماكينة' : 'Machine'}
            value={formData.machineId}
            options={machineOptions.map(m => ({ value: m.id, label: `${m.id} - ${m.name}` }))}
            onChange={(v) => handleChange('machineId', v)}
            error={errors.machineId}
            colors={colors}
            isDark={isDark}
          />

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label={language === 'ar' ? 'الوردية' : 'Shift'}
              value={formData.shift}
              options={shiftOptions}
              onChange={(v) => handleChange('shift', v)}
              colors={colors}
              isDark={isDark}
            />
            <InputField
              icon={<Clock className="w-4 h-4" />}
              label={language === 'ar' ? 'الوقت' : 'Timestamp'}
              type="datetime-local"
              value={formData.timestamp}
              onChange={(v) => handleChange('timestamp', v)}
              colors={colors}
              isDark={isDark}
            />
          </div>

          <InputField
            label={language === 'ar' ? 'اسم المشغل' : 'Operator Name'}
            value={formData.operator}
            onChange={(v) => handleChange('operator', v)}
            placeholder={language === 'ar' ? 'أدخل اسم المشغل...' : 'Enter operator name...'}
            colors={colors}
            isDark={isDark}
          />

          <div className="h-px my-4" style={{ background: colors.border }} />

          {/* Type-specific Fields */}
          {renderFormFields()}
        </form>

        {/* Footer */}
        <div
          className="p-6 flex justify-end gap-3"
          style={{ borderTop: `1px solid ${colors.border}` }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-medium transition-colors"
            style={{
              background: colors.bgTertiary,
              color: colors.textSecondary,
              border: `1px solid ${colors.border}`,
            }}
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isSubmitting || submitSuccess}
            className="px-6 py-2.5 rounded-xl text-white font-medium flex items-center gap-2 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
            }}
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {language === 'ar' ? 'حفظ' : 'Save Entry'}
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Input Field Component
const InputField = ({ icon, label, type = 'text', value, onChange, error, colors, isDark, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium" style={{ color: colors?.textSecondary || '#666564' }}>
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: colors?.textMuted || '#9C9A99' }}
        >
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${icon ? 'pl-10' : 'pl-4'} pr-4`}
        style={{
          background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F9FAFB',
          border: error ? '1px solid #EF4444' : `1px solid ${colors?.border || '#EAEAEA'}`,
          color: colors?.textPrimary || '#2E2D2C',
        }}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// Select Field Component
const SelectField = ({ label, value, options, onChange, error, colors, isDark }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium" style={{ color: colors?.textSecondary || '#666564' }}>
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl py-2.5 px-4 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      style={{
        background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F9FAFB',
        border: error ? '1px solid #EF4444' : `1px solid ${colors?.border || '#EAEAEA'}`,
        color: colors?.textPrimary || '#2E2D2C',
      }}
    >
      <option value="" style={{ background: isDark ? '#1F2937' : '#FFFFFF' }}>
        Select...
      </option>
      {options.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
          style={{ background: isDark ? '#1F2937' : '#FFFFFF' }}
        >
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// TextArea Field Component
const TextAreaField = ({ label, value, onChange, error, colors, isDark, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium" style={{ color: colors?.textSecondary || '#666564' }}>
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="w-full rounded-xl py-2.5 px-4 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
      style={{
        background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F9FAFB',
        border: error ? '1px solid #EF4444' : `1px solid ${colors?.border || '#EAEAEA'}`,
        color: colors?.textPrimary || '#2E2D2C',
      }}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// Checkbox Field Component
const CheckboxField = ({ label, checked, onChange, colors, isDark }) => (
  <label
    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors"
    style={{
      background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F9FAFB',
      border: `1px solid ${colors?.border || '#EAEAEA'}`,
    }}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-5 h-5 rounded border-2 text-blue-500 focus:ring-blue-500/50"
      style={{ borderColor: colors?.border || '#EAEAEA' }}
    />
    <span
      className="text-sm font-medium"
      style={{ color: checked ? '#10B981' : colors?.textSecondary || '#666564' }}
    >
      {label}
    </span>
  </label>
);

export default ManualEntryForm;
