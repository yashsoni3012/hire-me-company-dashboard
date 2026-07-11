import { useState, useEffect } from "react";
import { TbPencil, TbEye, TbPlus, } from "react-icons/tb";
import Modal from "./Modal";
import Button from "./Button";
import { useToast } from "../../context/ToastContext";

export default function FormModal({
  isOpen,
  onClose,
  onSave,
  title,
  fields,
  initialData = {},
  validationRules = {},
  mode = "view", // 'view' | 'edit' | 'add'
  size = "lg",
}) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const { showSuccess, showError } = useToast();

  const isReadOnly = mode === "view";

  const getIcon = () => {
    switch (mode) {
      case "view":
        return TbEye;
      case "edit":
        return TbPencil;
      case "add":
        return TbPlus;
      default:
        return null;
    }
  };

  const getIconColor = () => {
    switch (mode) {
      case "view":
        return "info";
      case "edit":
        return "brand";
      case "add":
        return "success";
      default:
        return "brand";
    }
  };

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setErrors({});
      setTouched({});
    }
  }, [isOpen, initialData]);

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return "";

    if (rules.required && !value) {
      return rules.message || `${name} is required`;
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      return `${name} must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value && value.length > rules.maxLength) {
      return `${name} must be at most ${rules.maxLength} characters`;
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      return rules.message || `${name} is invalid`;
    }

    if (rules.custom && value) {
      const customError = rules.custom(value);
      if (customError) return customError;
    }

    return "";
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const value = formData[name];
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    fields.forEach((field) => {
      const value = formData[field.name];
      const error = validateField(field.name, value);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isReadOnly) {
      onClose();
      return;
    }

    if (!validateForm()) {
      showError("Please fix the errors before saving");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      showSuccess(`${mode === "add" ? "Added" : "Updated"} successfully!`);
      onClose();
    } catch (error) {
      showError(error.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    const value = formData[field.name] || "";
    const error = errors[field.name];
    const isTouched = touched[field.name];
    const hasError = isTouched && !!error;
    const isDisabled = isReadOnly || field.disabled;

    const commonProps = {
      id: field.name,
      name: field.name,
      value: value,
      onBlur: () => handleBlur(field.name),
      disabled: isDisabled,
      className: `w-full px-4 py-2.5 text-sm rounded-xl border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none ${
        isDisabled
          ? "bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed border-gray-200 dark:border-gray-700"
          : "hover:border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      } ${
        hasError
          ? "border-danger-500 dark:border-danger-500 focus:ring-danger-500/20"
          : "border-gray-200 dark:border-gray-700"
      }`,
    };

    const labelClasses = `block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2`;

    switch (field.type) {
      case "textarea":
        return (
          <div key={field.name} className="mb-5">
            <label className={labelClasses}>
              {field.label}
              {field.required && (
                <span className="text-danger-500 ml-1">*</span>
              )}
            </label>
            <textarea
              {...commonProps}
              rows={field.rows || 4}
              placeholder={field.placeholder}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
            {hasError && (
              <p className="mt-1.5 text-xs text-danger-500 flex items-center gap-1">
                <span className="text-danger-500">●</span> {error}
              </p>
            )}
            {field.help && !hasError && (
              <p className="mt-1.5 text-xs text-gray-400">{field.help}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.name} className="mb-5">
            <label className={labelClasses}>
              {field.label}
              {field.required && (
                <span className="text-danger-500 ml-1">*</span>
              )}
            </label>
            <select
              {...commonProps}
              onChange={(e) => handleChange(field.name, e.target.value)}
            >
              <option value="">Select {field.label}...</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {hasError && (
              <p className="mt-1.5 text-xs text-danger-500 flex items-center gap-1">
                <span className="text-danger-500">●</span> {error}
              </p>
            )}
          </div>
        );

      case "number":
        return (
          <div key={field.name} className="mb-5">
            <label className={labelClasses}>
              {field.label}
              {field.required && (
                <span className="text-danger-500 ml-1">*</span>
              )}
            </label>
            <input
              {...commonProps}
              type="number"
              min={field.min}
              max={field.max}
              step={field.step || 1}
              placeholder={field.placeholder}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
            {hasError && (
              <p className="mt-1.5 text-xs text-danger-500 flex items-center gap-1">
                <span className="text-danger-500">●</span> {error}
              </p>
            )}
          </div>
        );

      case "email":
        return (
          <div key={field.name} className="mb-5">
            <label className={labelClasses}>
              {field.label}
              {field.required && (
                <span className="text-danger-500 ml-1">*</span>
              )}
            </label>
            <input
              {...commonProps}
              type="email"
              placeholder={field.placeholder || "example@email.com"}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
            {hasError && (
              <p className="mt-1.5 text-xs text-danger-500 flex items-center gap-1">
                <span className="text-danger-500">●</span> {error}
              </p>
            )}
          </div>
        );

      case "date":
        return (
          <div key={field.name} className="mb-5">
            <label className={labelClasses}>
              {field.label}
              {field.required && (
                <span className="text-danger-500 ml-1">*</span>
              )}
            </label>
            <input
              {...commonProps}
              type="date"
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
            {hasError && (
              <p className="mt-1.5 text-xs text-danger-500 flex items-center gap-1">
                <span className="text-danger-500">●</span> {error}
              </p>
            )}
          </div>
        );

      default:
        return (
          <div key={field.name} className="mb-5">
            <label className={labelClasses}>
              {field.label}
              {field.required && (
                <span className="text-danger-500 ml-1">*</span>
              )}
            </label>
            <input
              {...commonProps}
              type={field.type || "text"}
              placeholder={field.placeholder}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
            {hasError && (
              <p className="mt-1.5 text-xs text-danger-500 flex items-center gap-1">
                <span className="text-danger-500">●</span> {error}
              </p>
            )}
            {field.help && !hasError && (
              <p className="mt-1.5 text-xs text-gray-400">{field.help}</p>
            )}
          </div>
        );
    }
  };

  // Group fields into rows (2 columns)
  const renderFields = () => {
    const grouped = [];
    for (let i = 0; i < fields.length; i += 2) {
      grouped.push(fields.slice(i, i + 2));
    }
    return grouped;
  };

  const getModalTitle = () => {
    switch (mode) {
      case "view":
        return `View ${title}`;
      case "edit":
        return `Edit ${title}`;
      case "add":
        return `Add New ${title}`;
      default:
        return title;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      icon={getIcon()}
      iconColor={getIconColor()}
      size={size}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-2">
          {renderFields().map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {row.map((field) => renderField(field))}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-gray-100 dark:border-gray-800">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            className="px-6"
          >
            {isReadOnly ? "Close" : "Cancel"}
          </Button>
          {!isReadOnly && (
            <Button
              type="submit"
              disabled={isSubmitting}
              icon={TbSave}
              className="px-6"
            >
              {isSubmitting
                ? "Saving..."
                : mode === "add"
                  ? "Add Record"
                  : "Save Changes"}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
