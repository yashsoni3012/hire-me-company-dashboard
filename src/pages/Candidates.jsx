import { useState } from "react";
import {
  TbUserPlus,
  TbUsers,
  TbUserCheck,
  TbUserX,
  TbMapPin,
  TbEye,
  TbEdit,
  TbTrash,
  TbMessage,
} from "react-icons/tb";
import { CANDIDATES } from "../data/staticData";
import Badge from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import ExportPopup from "../components/ui/ExportPopup";
import BulkActionBar from "../components/ui/BulkActionBar";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import DataTable from "../components/ui/DataTable";
import FormModal from "../components/ui/FormModal";
import { exportToExcel } from "../utils/exportExcel";
import { useSelection } from "../hooks/useSelection";
import { useToast } from "../context/ToastContext";

export default function Candidates() {
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [candidates, setCandidates] = useState(CANDIDATES);
  const [modalMode, setModalMode] = useState("view");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "danger",
  });

  const { showSuccess, showError, showInfo } = useToast();
  const {
    selectedItems,
    toggleItem,
    toggleAll,
    clearSelection,
    isSelected,
    getSelectedItems,
    getSelectedCount,
  } = useSelection();

  const candidateFields = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "e.g. John Doe",
      validation: {
        required: true,
        minLength: 2,
        maxLength: 50,
        message: "Name is required (min 2 characters)",
      },
    },
    {
      name: "role",
      label: "Role/Position",
      type: "text",
      required: true,
      placeholder: "e.g. React Developer",
      validation: {
        required: true,
        minLength: 2,
        maxLength: 50,
        message: "Role is required",
      },
    },
    {
      name: "exp",
      label: "Experience",
      type: "text",
      required: true,
      placeholder: "e.g. 4 yrs",
      validation: {
        required: true,
        minLength: 2,
        message: "Experience is required",
      },
    },
    {
      name: "location",
      label: "Location",
      type: "text",
      required: true,
      placeholder: "e.g. Ahmedabad",
      validation: {
        required: true,
        minLength: 2,
        maxLength: 50,
        message: "Location is required",
      },
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { value: "active", label: "Active" },
        { value: "pending", label: "Pending" },
        { value: "rejected", label: "Rejected" },
      ],
      validation: {
        required: true,
        message: "Status is required",
      },
    },
    {
      name: "applied",
      label: "Applied to Jobs",
      type: "number",
      required: false,
      min: 0,
      validation: {
        minLength: 0,
      },
    },
  ];

  const miniStats = [
    {
      icon: TbUsers,
      color:
        "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400",
      value: candidates.length,
      label: "Total Candidates",
    },
    {
      icon: TbUserCheck,
      color:
        "bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-400",
      value: candidates.filter((c) => c.status === "active").length,
      label: "Active",
    },
    {
      icon: TbUserX,
      color:
        "bg-danger-50 text-danger-500 dark:bg-danger-900/30 dark:text-danger-400",
      value: candidates.filter((c) => c.status === "rejected").length,
      label: "Rejected",
    },
  ];

  const columns = [
    {
      header: "Candidate",
      key: "name",
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <Avatar initials={item.avatar} size="sm" />
          <span className="font-semibold text-gray-800 dark:text-white whitespace-nowrap">
            {item.name}
          </span>
        </div>
      ),
    },
    {
      header: "Role",
      key: "role",
      cellClassName: "text-gray-500 dark:text-gray-400 whitespace-nowrap",
    },
    {
      header: "Experience",
      key: "exp",
      cellClassName: "text-gray-500 dark:text-gray-400",
    },
    {
      header: "Location",
      key: "location",
      render: (item) => (
        <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
          <TbMapPin size={13} className="inline mr-1 text-gray-400" />
          {item.location}
        </span>
      ),
    },
    {
      header: "Applied To",
      key: "applied",
      render: (item) => <Badge status="purple">{item.applied} jobs</Badge>,
    },
    {
      header: "Status",
      key: "status",
      render: (item) => <Badge status={item.status} />,
    },
  ];

  const handleExport = (exportData) => {
    const { data, format, fileName, scope } = exportData;

    const exportableData = data.map((item) => ({
      Name: item.name,
      Role: item.role,
      Experience: item.exp,
      Location: item.location,
      "Applied To": `${item.applied} jobs`,
      Status: item.status,
    }));

    try {
      exportToExcel(exportableData, fileName || "candidates_list", format);
      const scopeText = scope === "selected" ? "selected " : "";
      showSuccess(
        `Exported ${data.length} ${scopeText}candidates successfully!`,
      );
      clearSelection();
    } catch (error) {
      showError(`Export failed: ${error.message}`);
    }
  };

  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEditCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleAddCandidate = () => {
    setSelectedCandidate({
      id: candidates.length + 1,
      name: "",
      role: "",
      exp: "",
      location: "",
      status: "pending",
      applied: 0,
      avatar: "NC",
    });
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleSaveCandidate = (formData) => {
    if (modalMode === "add") {
      const newCandidate = {
        ...formData,
        id: candidates.length + 1,
        avatar: formData.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
      };
      setCandidates((prev) => [newCandidate, ...prev]);
      showSuccess("Candidate added successfully!");
    } else if (modalMode === "edit") {
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === formData.id ? { ...formData, avatar: c.avatar } : c,
        ),
      );
      showSuccess("Candidate updated successfully!");
    }
    setIsModalOpen(false);
  };

  const handleDeleteCandidate = (candidate) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Candidate",
      message: `Are you sure you want to delete "${candidate.name}"? This action cannot be undone.`,
      type: "danger",
      onConfirm: () => {
        setCandidates((prev) => prev.filter((c) => c.id !== candidate.id));
        showSuccess(`Candidate "${candidate.name}" deleted successfully!`);
        setConfirmDialog({
          isOpen: false,
          title: "",
          message: "",
          onConfirm: null,
          type: "danger",
        });
      },
    });
  };

  const handleBulkDelete = () => {
    const selectedCandidates = getSelectedItems(candidates);
    if (selectedCandidates.length === 0) return;

    setConfirmDialog({
      isOpen: true,
      title: "Bulk Delete Candidates",
      message: `Are you sure you want to delete ${selectedCandidates.length} selected candidates? This action cannot be undone.`,
      type: "danger",
      onConfirm: () => {
        setCandidates((prev) => prev.filter((c) => !selectedItems.has(c.id)));
        const count = selectedCandidates.length;
        clearSelection();
        showSuccess(`${count} candidates deleted successfully!`);
        setConfirmDialog({
          isOpen: false,
          title: "",
          message: "",
          onConfirm: null,
          type: "danger",
        });
      },
    });
  };

  const handleBulkExport = () => {
    if (getSelectedCount() === 0) {
      showInfo("Please select at least one candidate to export.");
      return;
    }
    setShowExportPopup(true);
  };

  const handleBulkEmail = () => {
    const selectedCandidates = getSelectedItems(candidates);
    if (selectedCandidates.length === 0) {
      showInfo("Please select at least one candidate to email.");
      return;
    }
    showInfo(`Preparing to email ${selectedCandidates.length} candidates...`);
  };

  return (
    <div className="py-2">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          Candidates
          {getSelectedCount() > 0 && (
            <span className="ml-2 text-lg font-normal text-brand-500">
              ({getSelectedCount()} selected)
            </span>
          )}
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Track all registered candidates and their applications.
        </p>
      </div>

      <DataTable
        title="All Candidates"
        data={candidates}
        columns={columns}
        searchPlaceholder="Search candidates..."
        filterOptions={["active", "pending", "rejected"]}
        filterKey="status"
        miniStats={miniStats}
        selectedCount={getSelectedCount()}
        allSelected={
          candidates.length > 0 &&
          candidates.every((item) => selectedItems.has(item.id))
        }
        onToggleAll={toggleAll}
        onToggleItem={toggleItem}
        isSelected={isSelected}
        onAdd={handleAddCandidate}
        onExport={() => setShowExportPopup(true)}
        onDelete={handleDeleteCandidate}
        onEdit={handleEditCandidate}
        onView={handleViewCandidate}
        addButtonText="Add Candidate"
        exportButtonText="Export"
        renderCustomAction={(item) => (
          <button
            onClick={() => showInfo(`Messaging candidate: ${item.name}`)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-600"
          >
            <TbMessage size={15} />
          </button>
        )}
      />

      <BulkActionBar
        selectedCount={getSelectedCount()}
        onClear={clearSelection}
        onDelete={handleBulkDelete}
        onExport={handleBulkExport}
        onEmail={handleBulkEmail}
      />

      <ExportPopup
        isOpen={showExportPopup}
        onClose={() => setShowExportPopup(false)}
        onExport={handleExport}
        title="Candidates"
        data={
          getSelectedCount() > 0 ? getSelectedItems(candidates) : candidates
        }
        selectedCount={getSelectedCount()}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() =>
          setConfirmDialog({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: null,
            type: "danger",
          })
        }
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCandidate}
        title={
          modalMode === "view"
            ? "View Candidate"
            : modalMode === "edit"
              ? "Edit Candidate"
              : "Add New Candidate"
        }
        fields={candidateFields}
        initialData={selectedCandidate || {}}
        validationRules={candidateFields.reduce((acc, field) => {
          if (field.validation) {
            acc[field.name] = field.validation;
          }
          return acc;
        }, {})}
        mode={modalMode}
        size="lg"
      />
    </div>
  );
}
