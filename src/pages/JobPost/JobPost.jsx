import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Briefcase,
  IndianRupee,
  Search,
  X,
  Calendar,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Indent,
  Outdent,
  ChevronDown,
  Check,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  Layers,
} from "lucide-react";

import {
  LOOKUP_CONFIG,
  fetchLookup,
  didLookupFallback,
  postJob,
  postJobs,
} from "./services/jobPostService";

/* ---------------------------------------------------------- */
/* Shared UI primitives                                        */
/* ---------------------------------------------------------- */
function Field({ label, required, error, children, hint }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-purple-500/30";
const inputOk = "border-gray-200 focus:border-purple-500";
const inputErr = "border-red-300 focus:border-red-400";

function Chip({ text, onRemove }) {
  return (
    <span className="flex items-center gap-1 rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
      {text}
      <button 
        type="button" 
        onClick={onRemove} 
        className="rounded-full p-0.5 hover:bg-purple-100"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

/* ---------------------------------------------------------- */
/* Single select dropdown — fetches its own data lazily        */
/* ---------------------------------------------------------- */
function SelectDropdown({ options = [], value, onChange, placeholder, error, loading, onOpen }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const safeOptions = Array.isArray(options) ? options : [];
  const selected = safeOptions.find((o) => o.id === value);

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const handleToggle = () => {
    setOpen((o) => {
      const next = !o;
      if (next && onOpen) onOpen();
      return next;
    });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={handleToggle}
        className={`${inputBase} ${error ? inputErr : inputOk} flex items-center justify-between text-left`}
      >
        <span className={selected ? "text-gray-800" : "text-gray-400"}>
          {loading ? "Loading..." : selected ? selected.name : placeholder}
        </span>
        {loading ? <Loader2 className="h-4 w-4 animate-spin text-gray-400" /> : (
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        )}
      </button>
      {open && (
        <div className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {loading && <p className="px-3 py-3 text-xs text-gray-400">Loading options...</p>}
          {!loading && safeOptions.length === 0 && <p className="px-3 py-3 text-xs text-gray-400">No options</p>}
          {!loading && safeOptions.map((opt) => (
            <button
              type="button"
              key={opt.id}
              onClick={() => { onChange(opt.id); setOpen(false); }}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
            >
              {opt.name}
              {value === opt.id && <Check className="h-3.5 w-3.5 text-purple-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- */
/* Flat searchable multi-select — lazy loaded on first open    */
/* ---------------------------------------------------------- */
function MultiSelectSearch({ options = [], selectedIds = [], onChange, placeholder, loading, onOpen }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const safeOptions = Array.isArray(options) ? options : [];
  const safeSelectedIds = Array.isArray(selectedIds) ? selectedIds : [];
  const selectedOptions = safeOptions.filter((o) => safeSelectedIds.includes(o.id));
  const filtered = safeOptions.filter(
    (o) => o.name?.toLowerCase().includes(query.toLowerCase()) && !safeSelectedIds.includes(o.id)
  );

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const add = (id) => {
    onChange(Array.from(new Set([...safeSelectedIds, id])));
    setQuery("");
  };
  const remove = (id) => onChange(safeSelectedIds.filter((s) => s !== id));

  return (
    <div className="relative" ref={ref}>
      <div className="flex min-h-[46px] w-full flex-wrap items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-2 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/30">
        {selectedOptions.map((o) => (
          <Chip key={o.id} text={o.name} onRemove={() => remove(o.id)} />
        ))}
        <div className="flex flex-1 items-center gap-1.5 min-w-[120px]">
          {loading ? <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-gray-400" /> : <Search className="h-3.5 w-3.5 shrink-0 text-gray-400" />}
          <input
            type="text"
            value={query}
            onFocus={() => { setOpen(true); if (onOpen) onOpen(); }}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={selectedOptions.length === 0 ? (loading ? "Loading..." : placeholder) : ""}
            className="w-full min-w-[80px] flex-1 border-none bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
          />
        </div>
      </div>
      {open && (
        <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {loading && <p className="px-3 py-3 text-xs text-gray-400">Loading options...</p>}
          {!loading && filtered.length === 0 && <p className="px-3 py-3 text-xs text-gray-400">No matches</p>}
          {!loading && filtered.map((opt) => (
            <button
              type="button"
              key={opt.id}
              onClick={() => add(opt.id)}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
            >
              {opt.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

 /* ---------------------------------------------------------- */
/* Category -> sub-category checkbox picker - FIXED for all   */
/* ---------------------------------------------------------- */
function CategoryCheckboxDropdown({
  categories = [],
  subItems = [],
  selectedCategoryIds = [],
  selectedSubIds = [],
  onChangeCategories,
  onChangeSubs,
  placeholder = "Select",
  loading = false,
  onOpen,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const ref = useRef(null);

  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeSubItems = Array.isArray(subItems) ? subItems : [];

  // Filter sub-items to ONLY show those belonging to the active category
  const subsForActive = activeCategory 
    ? safeSubItems.filter((s) => s.parentId === activeCategory)
    : [];

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // When dropdown opens, set the first category as active if none is selected
  useEffect(() => {
    if (open && activeCategory == null && safeCategories.length > 0) {
      setActiveCategory(selectedCategoryIds[0] ?? safeCategories[0].id);
    }
  }, [open, safeCategories, selectedCategoryIds, activeCategory]);

  const handleToggleOpen = () => {
    setOpen((o) => {
      const next = !o;
      if (next && onOpen) onOpen();
      return next;
    });
  };

  const filteredCategories = safeCategories.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCategorySelected = (id) => {
    const isSelected = selectedCategoryIds.includes(id);
    if (isSelected) {
      onChangeCategories(selectedCategoryIds.filter((c) => c !== id));
      const idsToDrop = safeSubItems.filter((s) => s.parentId === id).map((s) => s.id);
      onChangeSubs(selectedSubIds.filter((s) => !idsToDrop.includes(s)));
    } else {
      onChangeCategories(Array.from(new Set([...selectedCategoryIds, id])));
    }
  };

  const toggleSub = (id) => {
    if (selectedSubIds.includes(id)) onChangeSubs(selectedSubIds.filter((s) => s !== id));
    else onChangeSubs(Array.from(new Set([...selectedSubIds, id])));
  };

  const removeCategory = (id) => toggleCategorySelected(id);
  const removeSub = (id) => onChangeSubs(selectedSubIds.filter((s) => s !== id));

  const selectedCategoryNames = safeCategories.filter((c) => selectedCategoryIds.includes(c.id));
  const selectedSubNames = safeSubItems.filter((s) => selectedSubIds.includes(s.id));
  const totalSelected = selectedCategoryNames.length + selectedSubNames.length;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={handleToggleOpen}
        className={`${inputBase} ${inputOk} flex min-h-[46px] flex-wrap items-center gap-1.5 text-left`}
      >
        {loading ? (
          <span className="flex items-center gap-2 text-gray-400"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</span>
        ) : totalSelected === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          <>
            {selectedCategoryNames.slice(0, 2).map((c) => (
              <Chip key={`c-${c.id}`} text={c.name} onRemove={() => removeCategory(c.id)} />
            ))}
            {selectedSubNames.slice(0, 2).map((s) => (
              <Chip key={`s-${s.id}`} text={s.name} onRemove={() => removeSub(s.id)} />
            ))}
            {totalSelected > 4 && (
              <span className="text-xs font-medium text-gray-400">+{totalSelected - 4} more</span>
            )}
          </>
        )}
        <ChevronDown className={`ml-auto h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories..."
                className="w-full rounded-md border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-2 text-sm outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>
          </div>
          {loading ? (
            <p className="px-3 py-4 text-xs text-gray-400">Loading...</p>
          ) : (
            <div className="grid grid-cols-2 divide-x divide-gray-100">
              {/* Left column - Categories */}
              <div className="max-h-64 overflow-y-auto py-1">
                {filteredCategories.length === 0 && (
                  <p className="px-3 py-3 text-xs text-gray-400">No categories found</p>
                )}
                {filteredCategories.map((cat) => {
                  const subCount = safeSubItems.filter(s => s.parentId === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                      }}
                      className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition ${
                        activeCategory === cat.id ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.includes(cat.id)}
                        onChange={() => toggleCategorySelected(cat.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 shrink-0 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="flex-1 truncate">{cat.name}</span>
                      <span className="text-xs text-gray-400">({subCount})</span>
                      <ChevronDown className="h-3.5 w-3.5 shrink-0 -rotate-90 text-gray-300" />
                    </div>
                  );
                })}
              </div>
              
              {/* Right column - Sub-items for active category ONLY */}
              <div className="max-h-64 overflow-y-auto py-1">
                {activeCategory == null ? (
                  <p className="px-3 py-3 text-xs text-gray-400">Select a category</p>
                ) : subsForActive.length === 0 ? (
                  <p className="px-3 py-3 text-xs text-gray-400">No sub-items available for this category</p>
                ) : (
                  subsForActive.map((sub) => (
                    <label
                      key={sub.id}
                      className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-purple-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubIds.includes(sub.id)}
                        onChange={() => toggleSub(sub.id)}
                        className="h-4 w-4 shrink-0 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="flex-1 truncate">{sub.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-gray-100 px-3 py-2">
            <button
              type="button"
              onClick={() => { onChangeCategories([]); onChangeSubs([]); }}
              className="text-xs font-medium text-gray-400 hover:text-gray-600"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


/* ---------------------------------------------------------- */
/* Rich text editor                                            */
/* ---------------------------------------------------------- */
function RichTextEditor({ value, onChange, error }) {
  const editorRef = useRef(null);
  const isFocused = useRef(false);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (isFocused.current) return;
    if (el.innerHTML !== (value || "")) {
      el.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = (e) => {
    onChange(e.currentTarget.innerHTML);
  };

  const exec = (cmd, arg = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, arg);
    onChange(editorRef.current?.innerHTML || "");
  };

  const handleClear = () => {
    if (editorRef.current) editorRef.current.innerHTML = "";
    onChange("");
  };

  const ToolBtn = ({ icon: Icon, cmd, arg, title }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => exec(cmd, arg)}
      className="rounded-md p-1.5 text-gray-500 hover:bg-purple-50 hover:text-purple-700"
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className={`overflow-hidden rounded-lg border ${error ? inputErr : inputOk} bg-white focus-within:ring-2 focus-within:ring-purple-500/30`}>
      <div className="flex items-center gap-1 border-b border-gray-100 bg-gray-50 px-2 py-1.5">
        <ToolBtn icon={Bold} cmd="bold" title="Bold" />
        <ToolBtn icon={Italic} cmd="italic" title="Italic" />
        <ToolBtn icon={Underline} cmd="underline" title="Underline" />
        <span className="mx-1 h-4 w-px bg-gray-200" />
        <ToolBtn icon={ListOrdered} cmd="insertOrderedList" title="Numbered list" />
        <ToolBtn icon={List} cmd="insertUnorderedList" title="Bullet list" />
        <ToolBtn icon={Outdent} cmd="outdent" title="Decrease indent" />
        <ToolBtn icon={Indent} cmd="indent" title="Increase indent" />
        <span className="mx-1 h-4 w-px bg-gray-200" />
        <select
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => exec("formatBlock", e.target.value)}
          defaultValue=""
          className="rounded-md border-none bg-transparent text-xs text-gray-600 outline-none"
        >
          <option value="">Normal</option>
          <option value="H1">Heading 1</option>
          <option value="H2">Heading 2</option>
          <option value="H3">Heading 3</option>
        </select>
        <button
          type="button"
          onClick={handleClear}
          className="ml-auto text-xs font-medium text-gray-400 hover:text-gray-600"
        >
          Clear
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => { isFocused.current = true; }}
        onBlur={() => { isFocused.current = false; }}
        onInput={handleInput}
        data-placeholder="Outlines the roles and responsibilities the candidate will perform in this role."
        className="min-h-[160px] w-full px-3.5 py-2.5 text-sm text-gray-800 outline-none empty:before:text-gray-400 empty:before:content-[attr(data-placeholder)]"
      />
    </div>
  );
}

/* ---------------------------------------------------------- */
/* Static option lists                                         */
/* ---------------------------------------------------------- */
const POSTING_TYPES = [
  { id: "Permanent", name: "Permanent" },
  { id: "Contract", name: "Contract" },
  { id: "Walk-in", name: "Walk-in" },
];
const AUTO_RENEW_OPTIONS = [
  { id: "off", name: "Off" },
  { id: "weekly", name: "Weekly" },
  { id: "monthly", name: "Monthly" },
];
const BILLING_TYPES = [
  { id: "hourly", name: "Hourly" },
  { id: "monthly", name: "Monthly" },
  { id: "fixed", name: "Fixed price" },
];
const QUESTION_TYPES = [
  { id: "yesno", name: "Yes / No" },
  { id: "text", name: "Text answer" },
  { id: "mcq", name: "Multiple choice" },
];

const initialForm = {
  postingType: "Permanent",
  scheduleOption: "now",
  scheduleDate: "",
  expiryDate: "",
  autoRenew: "off",

  dailyApplicationSummary: true,
  individualApplications: true,
  notifyMatchingType: "All matching applicants",

  jobTitle: "",
  showReferenceCode: false,
  referenceCode: "",
  experienceMode: "experienced",
  minExperience: "",
  maxExperience: "",
  jobDescription: "",
  prioritizeWomen: false,

  skills: [],
  workplaceType: null,
  locations: [],
  minSalary: "",
  maxSalary: "",
  salaryConfidential: false,

  perkCategoryIds: [],
  perkIds: [],
  industryIds: [],
  subIndustryIds: [],
  functionRoles: [],
  educationCategoryIds: [],
  educationSubCategoryIds: [],

  folderName: "",
  addQuestionnaire: false,
  questions: [],

  billingType: "monthly",
  currency: null,
  contractTenure: "",
};

export default function JobPost() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [jobQueue, setJobQueue] = useState([]);
  const [batchResult, setBatchResult] = useState(null);

  const lookupKeys = Object.keys(LOOKUP_CONFIG);
  const [lookups, setLookups] = useState(Object.fromEntries(lookupKeys.map((k) => [k, []])));
  const [lookupLoading, setLookupLoading] = useState(Object.fromEntries(lookupKeys.map((k) => [k, false])));
  const [lookupWarning, setLookupWarning] = useState(false);
  const requestedRef = useRef({});

  const ensureLookup = useCallback((key) => {
    if (requestedRef.current[key]) return;
    requestedRef.current[key] = true;

    setLookupLoading((prev) => ({ ...prev, [key]: true }));
    fetchLookup(key).then((list) => {
      setLookups((prev) => ({ ...prev, [key]: list }));
      setLookupLoading((prev) => ({ ...prev, [key]: false }));
      if (didLookupFallback(key)) setLookupWarning(true);
    });
  }, []);

  const ensureIndustry = useCallback(() => { 
    ensureLookup("industries"); 
    ensureLookup("subIndustries"); 
  }, [ensureLookup]);
  
  const ensurePerks = useCallback(() => { 
    ensureLookup("perkCategories"); 
    ensureLookup("perks"); 
  }, [ensureLookup]);
  
  const ensureEducation = useCallback(() => { 
    ensureLookup("educationCategories"); 
    ensureLookup("educationSubCategories"); 
  }, [ensureLookup]);

  // Fetch job types in the background
  useEffect(() => {
    ensureLookup("jobTypes");
  }, [ensureLookup]);

  const set = (key) => (val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const isContract = form.postingType === "Contract";

  const addQuestion = () =>
    setForm((f) => ({
      ...f,
      questions: [...f.questions, { question: "", question_type: "text", text_placeholder: "", mcq_options: [], is_required: false }],
    }));
  const updateQuestion = (idx, patch) =>
    setForm((f) => ({ ...f, questions: f.questions.map((q, i) => (i === idx ? { ...q, ...patch } : q)) }));
  const removeQuestion = (idx) => setForm((f) => ({ ...f, questions: f.questions.filter((_, i) => i !== idx) }));

  const validate = () => {
    const e = {};

    // Job title validation
    if (!form.jobTitle?.trim()) {
      e.jobTitle = "Job title is required";
    }

    if (form.experienceMode === "experienced") {
      if (form.minExperience === "") e.minExperience = "Min experience is required";
      if (form.maxExperience === "") e.maxExperience = "Max experience is required";
      if (form.minExperience !== "" && form.maxExperience !== "" &&
          Number(form.minExperience) > Number(form.maxExperience)) {
        e.maxExperience = "Max experience must be ≥ min experience";
      }
    }

    const plainDescription = form.jobDescription?.replace(/<[^>]*>/g, "").trim();
    if (!plainDescription) e.jobDescription = "Job description is required";

    if (form.skills.length === 0) e.skills = "Select at least one skill";
    if (!form.workplaceType) e.workplaceType = "Select a workplace type";
    if (form.locations.length === 0) e.locations = "Select at least one location";

    if (form.minSalary === "") e.minSalary = "Min salary is required";
    if (form.maxSalary === "") e.maxSalary = "Max salary is required";
    if (form.minSalary !== "" && form.maxSalary !== "" &&
        Number(form.minSalary) > Number(form.maxSalary)) {
      e.maxSalary = "Max salary must be ≥ min salary";
    }

    if (form.industryIds.length === 0 && form.subIndustryIds.length === 0) e.industry = "Select an industry";
    if (form.functionRoles.length === 0) e.functionRoles = "Select at least one function / role";
    if (form.educationCategoryIds.length === 0 && form.educationSubCategoryIds.length === 0) e.education = "Select an education option";
    if (!form.folderName?.trim()) e.folderName = "Folder name is required";

    if (!form.expiryDate) e.expiryDate = "Expiry date is required";
    else if (new Date(form.expiryDate) < new Date(new Date().toDateString())) e.expiryDate = "Expiry date cannot be in the past";

    if (form.scheduleOption === "later" && !form.scheduleDate) e.scheduleDate = "Please select a schedule date";

    if (isContract && !form.currency) e.currency = "Select a currency";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nums = (arr) => (Array.isArray(arr) ? Array.from(new Set(arr.map(Number).filter((n) => !isNaN(n)))) : []);

  const buildPayload = (asDraft = false) => {
    const jobTitle = form.jobTitle?.trim();
    
    if (!jobTitle) {
      throw new Error("Job title is required");
    }

    const jobTypeId = lookups.jobTypes?.[0]?.id ?? 11;

    const payload = {
      title: jobTitle,
      job_type_id: Number(jobTypeId),
      posting_type: form.postingType || "Permanent",
      schedule_date: form.scheduleOption === "later" && form.scheduleDate
        ? new Date(form.scheduleDate).toISOString()
        : new Date().toISOString(),
      expiry_date: form.expiryDate,
      reference_code: form.referenceCode?.trim() || null,
      experience_type: form.experienceMode === "fresher" ? "Fresher" : "Experience",
      min_experience: form.experienceMode === "fresher" ? 0 : Number(form.minExperience) || 0,
      max_experience: form.experienceMode === "fresher" ? 0 : Number(form.maxExperience) || 0,
      job_description: form.jobDescription || "",
      auto_renew: form.autoRenew || "off",
      daily_application_summary: form.dailyApplicationSummary || false,
      notify_matching_type: form.individualApplications ? (form.notifyMatchingType || "All matching applicants") : "None",
      workplace_type_id: form.workplaceType ? Number(form.workplaceType) : null,
      min_salary: Number(form.minSalary) || 0,
      max_salary: Number(form.maxSalary) || 0,
      salary_confidential: form.salaryConfidential || false,
      folder_name: form.folderName?.trim() || "General",
      prioritize_women: form.prioritizeWomen || false,
      is_status: !asDraft,
      is_trending: false,
      company_id: 1,
      created_by: 1,
      skills: nums(form.skills),
      location_id: nums(form.locations),
      perks_benefit: nums(form.perkIds),
      industry_id: nums(form.industryIds),
      sub_industry_id: nums(form.subIndustryIds),
      function_role_id: nums(form.functionRoles),
      education_category_id: nums(form.educationCategoryIds),
      education_sub_category_id: nums(form.educationSubCategoryIds),
      questions: form.addQuestionnaire
        ? form.questions.filter((q) => q.question?.trim()).map((q) => ({
            question: q.question.trim(),
            question_type: q.question_type || "text",
            text_placeholder: q.text_placeholder || null,
            mcq_options: q.mcq_options || [],
            is_required: q.is_required || false,
          }))
        : [],
    };

    if (isContract) {
      payload.currency_id = form.currency ? Number(form.currency) : null;
      payload.billing_type = form.billingType;
      payload.contract_tenure = form.contractTenure || null;
    }

    console.log("📤 Generated payload:", JSON.stringify(payload, null, 2));
    return payload;
  };

  const submitJob = useCallback(async (asDraft = false) => {
    setStatusMsg("");
    setBatchResult(null);
    setStatus("submitting");

    if (!validate()) {
      setStatus("error");
      setStatusMsg("Please fix the highlighted fields before posting.");
      return;
    }

    try {
      const payload = buildPayload(asDraft);
      const result = await postJob(payload);
      console.log("✅ Job posted successfully:", result);
      
      setStatus("success");
      setStatusMsg(asDraft ? "Job saved as draft!" : "Job posted successfully!");
      setForm(initialForm);
      setErrors({});
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error("❌ Submit error:", err);
      setStatus("error");
      setStatusMsg(err.message || "Something went wrong while posting the job.");
    }
  }, [form, lookups.jobTypes]);

  const addToQueue = () => {
    if (!validate()) {
      setStatus("error");
      setStatusMsg("Please fix the highlighted fields before adding to the batch.");
      return;
    }
    try {
      const payload = buildPayload(false);
      setJobQueue((q) => [...q, payload]);
      setForm(initialForm);
      setErrors({});
      setStatus("idle");
      setStatusMsg("");
    } catch (err) {
      setStatus("error");
      setStatusMsg(err.message);
    }
  };

  const removeFromQueue = (idx) => setJobQueue((q) => q.filter((_, i) => i !== idx));

  const postQueue = async () => {
    if (jobQueue.length === 0) return;
    setStatus("submitting");
    setBatchResult(null);
    const { succeeded, failed } = await postJobs(jobQueue);
    setBatchResult({ succeeded: succeeded.length, failed });
    setJobQueue(failed.map((f) => f.payload));
    setStatus(failed.length === 0 ? "success" : "error");
    setStatusMsg(
      failed.length === 0
        ? `All ${succeeded.length} job(s) posted successfully!`
        : `${succeeded.length} posted, ${failed.length} failed — see details below.`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28 pt-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
            <Briefcase className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-bold text-gray-900">Post a Job</h1>
        </div>

        {lookupWarning && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <AlertCircle className="h-4 w-4 shrink-0" /> Some dropdowns couldn't load from the live API, so placeholder options are shown.
          </div>
        )}
        {status === "success" && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <Check className="h-4 w-4 shrink-0" /> {statusMsg}
          </div>
        )}
        {status === "error" && statusMsg && (
          <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> <span className="break-words">{statusMsg}</span>
          </div>
        )}
        {batchResult && batchResult.failed.length > 0 && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <p className="mb-1 font-semibold">{batchResult.failed.length} job(s) failed to post:</p>
            <ul className="list-disc pl-5">
              {batchResult.failed.map((f, i) => (
                <li key={i}>{f.payload.title}: {f.error}</li>
              ))}
            </ul>
          </div>
        )}

        {jobQueue.length > 0 && (
          <div className="mb-5 rounded-xl border border-purple-200 bg-purple-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-800">
              <Layers className="h-4 w-4" /> {jobQueue.length} job(s) queued to post
            </div>
            <ul className="mb-3 space-y-1">
              {jobQueue.map((j, idx) => (
                <li key={idx} className="flex items-center justify-between rounded-md bg-white px-3 py-1.5 text-sm text-gray-700">
                  {j.title}
                  <button type="button" onClick={() => removeFromQueue(idx)} className="text-gray-400 hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={postQueue}
              disabled={status === "submitting"}
              className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
            >
              {status === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Briefcase className="h-4 w-4" />}
              Post all {jobQueue.length} job(s)
            </button>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
          {/* ================= LEFT: Posting details ================= */}
          <div className="space-y-5">
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-bold text-gray-900">Posting details</h2>

              <div className="mb-4 grid grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1">
                {POSTING_TYPES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => set("postingType")(p.id)}
                    className={`rounded-md px-2 py-1.5 text-xs font-semibold transition ${
                      form.postingType === p.id ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              <div className="mt-1">
                <p className="mb-1.5 text-sm font-medium text-gray-700">Schedule job post</p>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="radio" checked={form.scheduleOption === "now"} onChange={() => set("scheduleOption")("now")} className="h-4 w-4 text-purple-600 focus:ring-purple-500" />
                    Post now
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="radio" checked={form.scheduleOption === "later"} onChange={() => set("scheduleOption")("later")} className="h-4 w-4 text-purple-600 focus:ring-purple-500" />
                    Choose a date
                  </label>
                  {form.scheduleOption === "later" && (
                    <input
                      type="date"
                      value={form.scheduleDate}
                      onChange={(e) => set("scheduleDate")(e.target.value)}
                      className={`${inputBase} ${errors.scheduleDate ? inputErr : inputOk}`}
                    />
                  )}
                </div>
              </div>

              <div className="mt-4">
                <Field label="Expiry date" required error={errors.expiryDate}>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={form.expiryDate}
                      onChange={(e) => set("expiryDate")(e.target.value)}
                      className={`${inputBase} ${errors.expiryDate ? inputErr : inputOk} pl-9`}
                    />
                  </div>
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Auto renew">
                  <SelectDropdown options={AUTO_RENEW_OPTIONS} value={form.autoRenew} onChange={set("autoRenew")} placeholder="Select auto-renew" />
                </Field>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-bold text-gray-900">Notify me for</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between text-sm text-gray-700">
                  Daily application summary
                  <input type="checkbox" checked={form.dailyApplicationSummary} onChange={(e) => set("dailyApplicationSummary")(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                </label>
                <label className="flex items-center justify-between text-sm text-gray-700">
                  Individual applications
                  <input type="checkbox" checked={form.individualApplications} onChange={(e) => set("individualApplications")(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                </label>
                {form.individualApplications && (
                  <div className="space-y-2 pl-1">
                    {["All matching applicants", "Top matches only"].map((opt) => (
                      <label key={opt} className="flex items-center gap-2 text-sm text-gray-600">
                        <input type="radio" checked={form.notifyMatchingType === opt} onChange={() => set("notifyMatchingType")(opt)} className="h-4 w-4 text-purple-600 focus:ring-purple-500" />
                        {opt}
                        {opt === "All matching applicants" && <span className="text-xs text-gray-400">(we won't send non-matching applications)</span>}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= RIGHT: Job details ================= */}
          <div className="space-y-5">
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="mb-4 text-sm font-bold text-gray-900">Job details</h2>

              <div className="grid grid-cols-1 gap-5">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <Field label="Job title" required error={errors.jobTitle}>
                      <input
                        type="text"
                        value={form.jobTitle || ""}
                        onChange={(e) => set("jobTitle")(e.target.value)}
                        placeholder="e.g. Mernstack Developer"
                        className={`${inputBase} ${errors.jobTitle ? inputErr : inputOk}`}
                      />
                    </Field>
                  </div>
                  {!form.showReferenceCode && (
                    <button
                      type="button"
                      onClick={() => set("showReferenceCode")(true)}
                      className="mt-7 shrink-0 flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700"
                    >
                      <Plus className="h-4 w-4" /> Add reference code
                    </button>
                  )}
                </div>

                {form.showReferenceCode && (
                  <Field label="Reference code" hint="Your internal job ID, e.g. JOB123">
                    <input
                      type="text"
                      value={form.referenceCode}
                      onChange={(e) => set("referenceCode")(e.target.value)}
                      placeholder="JOB123"
                      className={`${inputBase} ${inputOk}`}
                    />
                  </Field>
                )}

                <div>
                  <p className="mb-1.5 text-sm font-medium text-gray-700">
                    Experience <span className="text-red-500">*</span>
                  </p>
                  <div className="mb-3 inline-flex gap-2">
                    {[{ id: "fresher", name: "Fresher only" }, { id: "experienced", name: "Experienced only" }].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => set("experienceMode")(opt.id)}
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                          form.experienceMode === opt.id ? "border-gray-800 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {opt.name}
                      </button>
                    ))}
                  </div>
                  {form.experienceMode === "experienced" && (
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Min experience (years)" error={errors.minExperience}>
                        <input type="number" min="0" value={form.minExperience} onChange={(e) => set("minExperience")(e.target.value)} placeholder="0" className={`${inputBase} ${errors.minExperience ? inputErr : inputOk}`} />
                      </Field>
                      <Field label="Max experience (years)" error={errors.maxExperience}>
                        <input type="number" min="0" value={form.maxExperience} onChange={(e) => set("maxExperience")(e.target.value)} placeholder="2" className={`${inputBase} ${errors.maxExperience ? inputErr : inputOk}`} />
                      </Field>
                    </div>
                  )}
                </div>

                <Field label="Job description" required error={errors.jobDescription}>
                  <RichTextEditor value={form.jobDescription} onChange={set("jobDescription")} error={errors.jobDescription} />
                </Field>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-gray-500">This job will prioritize:</span>
                  <input type="checkbox" checked={form.prioritizeWomen} onChange={(e) => set("prioritizeWomen")(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  Women
                </label>
              </div>
            </div>

            {/* ---- Skills / Location / Salary / Perks / Industry / Roles / Education ---- */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
              <div className="grid grid-cols-1 gap-5">
                <Field label="Skills" required error={errors.skills} hint="Search by skills or title, e.g. Java, Customer Support">
                  <MultiSelectSearch
                    options={lookups.skills}
                    selectedIds={form.skills}
                    onChange={set("skills")}
                    placeholder="Search skills..."
                    loading={lookupLoading.skills}
                    onOpen={() => ensureLookup("skills")}
                  />
                </Field>

                <Field label="Job location" required error={errors.workplaceType || errors.locations}>
                  <div className="flex gap-2">
                    <div className="w-36 shrink-0">
                      <SelectDropdown
                        options={lookups.workplaceTypes}
                        value={form.workplaceType}
                        onChange={set("workplaceType")}
                        placeholder="On-site"
                        error={errors.workplaceType}
                        loading={lookupLoading.workplaceTypes}
                        onOpen={() => ensureLookup("workplaceTypes")}
                      />
                    </div>
                    <div className="flex-1">
                      <MultiSelectSearch
                        options={lookups.locations}
                        selectedIds={form.locations}
                        onChange={set("locations")}
                        placeholder="Select location..."
                        loading={lookupLoading.locations}
                        onOpen={() => ensureLookup("locations")}
                      />
                    </div>
                  </div>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Min salary (annually)" required error={errors.minSalary}>
                    <div className="relative">
                      <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input type="number" min="0" value={form.minSalary} onChange={(e) => set("minSalary")(e.target.value)} placeholder="300000" className={`${inputBase} ${errors.minSalary ? inputErr : inputOk} pl-9`} />
                    </div>
                  </Field>
                  <Field label="Max salary (annually)" required error={errors.maxSalary}>
                    <div className="relative">
                      <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input type="number" min="0" value={form.maxSalary} onChange={(e) => set("maxSalary")(e.target.value)} placeholder="600000" className={`${inputBase} ${errors.maxSalary ? inputErr : inputOk} pl-9`} />
                    </div>
                  </Field>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={form.salaryConfidential} onChange={(e) => set("salaryConfidential")(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  Keep salary confidential
                  <span className="text-xs font-medium text-amber-600">(Get 3X relevant applications if the salary is mentioned)</span>
                </label>

                <Field label="Perks and benefits" hint="Click a category to reveal its perks on the right; check boxes to select">
                  <CategoryCheckboxDropdown
                    categories={lookups.perkCategories}
                    subItems={lookups.perks}
                    selectedCategoryIds={form.perkCategoryIds}
                    selectedSubIds={form.perkIds}
                    onChangeCategories={set("perkCategoryIds")}
                    onChangeSubs={set("perkIds")}
                    placeholder="Eg. Cab Services, Paternity leave"
                    loading={lookupLoading.perkCategories || lookupLoading.perks}
                    onOpen={ensurePerks}
                  />
                </Field>

                <Field label="Industry" required error={errors.industry} hint="Click an industry to reveal its sub-industries on the right; check boxes to select">
                  <CategoryCheckboxDropdown
                    categories={lookups.industries}
                    subItems={lookups.subIndustries}
                    selectedCategoryIds={form.industryIds}
                    selectedSubIds={form.subIndustryIds}
                    onChangeCategories={set("industryIds")}
                    onChangeSubs={set("subIndustryIds")}
                    placeholder="Select industry"
                    loading={lookupLoading.industries || lookupLoading.subIndustries}
                    onOpen={ensureIndustry}
                  />
                </Field>

                <Field label="Functions and roles" required error={errors.functionRoles}>
                  <MultiSelectSearch
                    options={lookups.functionRoles}
                    selectedIds={form.functionRoles}
                    onChange={set("functionRoles")}
                    placeholder="Select function and roles..."
                    loading={lookupLoading.functionRoles}
                    onOpen={() => ensureLookup("functionRoles")}
                  />
                </Field>

                <Field label="Education" required error={errors.education} hint="Click a category to reveal its sub-categories on the right; check boxes to select">
                  <CategoryCheckboxDropdown
                    categories={lookups.educationCategories}
                    subItems={lookups.educationSubCategories}
                    selectedCategoryIds={form.educationCategoryIds}
                    selectedSubIds={form.educationSubCategoryIds}
                    onChangeCategories={set("educationCategoryIds")}
                    onChangeSubs={set("educationSubCategoryIds")}
                    placeholder="Select education"
                    loading={lookupLoading.educationCategories || lookupLoading.educationSubCategories}
                    onOpen={ensureEducation}
                  />
                </Field>

                {isContract && (
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <p className="mb-3 text-sm font-semibold text-gray-700">Contract details</p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Currency" required error={errors.currency}>
                        <SelectDropdown
                          options={lookups.currencies}
                          value={form.currency}
                          onChange={set("currency")}
                          placeholder="Select currency"
                          error={errors.currency}
                          loading={lookupLoading.currencies}
                          onOpen={() => ensureLookup("currencies")}
                        />
                      </Field>
                      <Field label="Billing type">
                        <SelectDropdown options={BILLING_TYPES} value={form.billingType} onChange={set("billingType")} placeholder="Select billing type" />
                      </Field>
                      <Field label="Contract tenure" hint='e.g. "Upto 6 months"'>
                        <input type="text" value={form.contractTenure} onChange={(e) => set("contractTenure")(e.target.value)} placeholder="Upto 6 months" className={`${inputBase} ${inputOk}`} />
                      </Field>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ---- Folder + Questionnaire ---- */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-gray-900">Folder</h3>
                <Field label="Folder to save this job" required error={errors.folderName}>
                  <input type="text" value={form.folderName} onChange={(e) => set("folderName")(e.target.value)} placeholder="FullStack Hiring" className={`${inputBase} ${errors.folderName ? inputErr : inputOk}`} />
                </Field>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-gray-900">Questionnaire</h3>
                <label className="mb-3 flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={form.addQuestionnaire} onChange={(e) => set("addQuestionnaire")(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  Add questionnaire to this job posting
                </label>

                {form.addQuestionnaire && (
                  <div className="space-y-3">
                    {form.questions.map((q, idx) => (
                      <div key={idx} className="rounded-lg border border-gray-200 p-3">
                        <div className="mb-2 flex items-start gap-2">
                          <input type="text" value={q.question} onChange={(e) => updateQuestion(idx, { question: e.target.value })} placeholder="Question text" className={`${inputBase} ${inputOk} flex-1`} />
                          <button type="button" onClick={() => removeQuestion(idx)} className="mt-1 shrink-0 rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <SelectDropdown options={QUESTION_TYPES} value={q.question_type} onChange={(val) => updateQuestion(idx, { question_type: val })} placeholder="Answer type" />
                          <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input type="checkbox" checked={q.is_required} onChange={(e) => updateQuestion(idx, { is_required: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                            Required
                          </label>
                        </div>
                        {q.question_type === "text" && (
                          <input type="text" value={q.text_placeholder} onChange={(e) => updateQuestion(idx, { text_placeholder: e.target.value })} placeholder="Placeholder text shown to applicant" className={`${inputBase} ${inputOk} mt-3`} />
                        )}
                        {q.question_type === "mcq" && (
                          <input
                            type="text"
                            value={q.mcq_options.join(", ")}
                            onChange={(e) => updateQuestion(idx, { mcq_options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                            placeholder="Comma-separated options, e.g. 1 Year, 2 Years, 3+ Years"
                            className={`${inputBase} ${inputOk} mt-3`}
                          />
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={addQuestion} className="flex items-center gap-1 rounded-md border border-purple-200 px-2.5 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-50">
                      <Plus className="h-3.5 w-3.5" /> Add question
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* ---- Sticky footer actions ---- */}
      <div className="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-3 px-4 py-3 sm:px-6">
          <button type="button" onClick={() => submitJob(true)} disabled={status === "submitting"} className="text-sm font-semibold text-purple-600 hover:text-purple-700 disabled:opacity-60">
            Save as draft
          </button>
          <button type="button" onClick={addToQueue} disabled={status === "submitting"} className="flex items-center gap-1.5 rounded-lg border border-purple-200 px-4 py-2.5 text-sm font-medium text-purple-600 hover:bg-purple-50 disabled:opacity-60">
            <Plus className="h-4 w-4" /> Add to batch
          </button>
          <button type="button" onClick={() => setShowPreview((s) => !s)} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Eye className="h-4 w-4" /> Preview job post
          </button>
          <button
            type="button"
            onClick={() => submitJob(false)}
            disabled={status === "submitting"}
            className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? (<><Loader2 className="h-4 w-4 animate-spin" /> Posting...</>) : (<><Briefcase className="h-4 w-4" /> Post job</>)}
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowPreview(false)}>
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{form.jobTitle || "Untitled job"}</h3>
              <button onClick={() => setShowPreview(false)} className="rounded-full p-1 hover:bg-gray-100"><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="mb-4 flex flex-wrap gap-2 text-xs text-gray-500">
              <span className="rounded-full bg-gray-100 px-3 py-1">{form.postingType}</span>
              {form.experienceMode === "fresher" ? (
                <span className="rounded-full bg-gray-100 px-3 py-1">Fresher</span>
              ) : (
                <span className="rounded-full bg-gray-100 px-3 py-1">{form.minExperience || 0}–{form.maxExperience || 0} yrs</span>
              )}
              {!form.salaryConfidential && (form.minSalary || form.maxSalary) && (
                <span className="rounded-full bg-gray-100 px-3 py-1">₹{form.minSalary || 0} – ₹{form.maxSalary || 0}</span>
              )}
            </div>
            <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: form.jobDescription || "<p class='text-gray-400'>No description yet.</p>" }} />
          </div>
        </div>
      )}
    </div>
  );
}