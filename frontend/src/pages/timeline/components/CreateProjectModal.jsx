import { useState } from "react";
import "./createProjectModal.scss";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

const LEISTUNG_TYPES = [
    "Grundlagenermittlung (LPH 1)",
    "Vorplanung (LPH 2)",
    "Entwurfsplanung (LPH 3)",
    "Genehmigungsplanung (LPH 4)",
    "Ausführungsplanung (LPH 5)",
    "Vorbereitung Vergabe (LPH 6)",
    "Mitwirkung Vergabe (LPH 7)",
    "Objektüberwachung (LPH 8)",
    "Objektbetreuung (LPH 9)",
];

export default function CreateProjectModal({ isOpen, onClose, onSave }) {
    if (!isOpen) return null;

    const [form, setForm] = useState({
        projectNumber: "",
        name: "",
        shortName: "",
        startDate: "",
        endDate: "",
    });

    const [phases, setPhases] = useState([]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const addPhase = () => {
        setPhases([
            ...phases,
            {
                id: Date.now(),
                type: LEISTUNG_TYPES[0],
                start: "",
                end: "",
                hours: 0,
            },
        ]);
    };

    const updatePhase = (id, field, value) => {
        setPhases((prev) =>
            prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
        );
    };

    const removePhase = (id) => {
        setPhases((prev) => prev.filter((p) => p.id !== id));
    };

    const handleSave = () => {
        const payload = {
            ...form,
            phases,
        };
        onSave(payload);
        onClose();
    };

    return (
        <div className="cpModalBackdrop">
            <div className="cpModal">
                <div className="cpHeader">
                    <h2 className="cpTitle">Create New Project</h2>
                    <button className="cpCloseBtn" onClick={onClose}>
                        <CloseRoundedIcon fontSize="small" />
                    </button>
                </div>

                <div className="cpBody">
                    {/* General Info */}
                    <div className="cpSection">
                        <h3 className="sectionLabel">Project Details</h3>
                        <div className="row2">
                            <label>
                                <span>Project Number</span>
                                <input
                                    type="text"
                                    name="projectNumber"
                                    value={form.projectNumber}
                                    onChange={handleChange}
                                    placeholder="202501"
                                />
                            </label>
                            <label>
                                <span>Short Name</span>
                                <input
                                    type="text"
                                    name="shortName"
                                    value={form.shortName}
                                    onChange={handleChange}
                                    placeholder="ABCD"
                                />
                            </label>
                        </div>
                        <label className="fullRow">
                            <span>Project Name</span>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Brühl Zentrum"
                            />
                        </label>
                        <div className="row2">
                            <label>
                                <span>Start Date</span>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={form.startDate}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                <span>End Date</span>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={form.endDate}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Leistungsphasen */}
                    <div className="cpSection">
                        <div className="sectionHeader">
                            <h3 className="sectionLabel">Leistungsphasen (Service Phases)</h3>
                            <button className="ghostBtnSmall" onClick={addPhase}>
                                <AddRoundedIcon fontSize="inherit" />
                                Add Phase
                            </button>
                        </div>

                        <div className="phasesList">
                            {phases.length === 0 && (
                                <div className="emptyState">No phases added yet.</div>
                            )}
                            {phases.map((ph, idx) => (
                                <div key={ph.id} className="phaseRow">
                                    <div className="phCol type">
                                        <label>Type</label>
                                        <select
                                            value={ph.type}
                                            onChange={(e) => updatePhase(ph.id, "type", e.target.value)}
                                        >
                                            {LEISTUNG_TYPES.map((t) => (
                                                <option key={t} value={t}>
                                                    {t}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="phCol date">
                                        <label>Start</label>
                                        <input
                                            type="date"
                                            value={ph.start}
                                            onChange={(e) => updatePhase(ph.id, "start", e.target.value)}
                                        />
                                    </div>
                                    <div className="phCol date">
                                        <label>End</label>
                                        <input
                                            type="date"
                                            value={ph.end}
                                            onChange={(e) => updatePhase(ph.id, "end", e.target.value)}
                                        />
                                    </div>
                                    <div className="phCol tiny">
                                        <label>Hours</label>
                                        <input
                                            type="number"
                                            value={ph.hours}
                                            onChange={(e) => updatePhase(ph.id, "hours", e.target.value)}
                                        />
                                    </div>
                                    <button
                                        className="delBtn"
                                        onClick={() => removePhase(ph.id)}
                                        title="Remove"
                                    >
                                        <DeleteOutlineRoundedIcon fontSize="small" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="cpFooter">
                    <button className="btn secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn primary" onClick={handleSave}>
                        Create Project
                    </button>
                </div>
            </div>
        </div>
    );
}
