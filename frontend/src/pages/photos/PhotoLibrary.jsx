import React, { useState } from "react";
import "./PhotoLibraryV2.scss";
import { photosDummy } from "../../data/photosDummy";

import SearchIcon from "@mui/icons-material/SearchRounded";
import FilterListIcon from "@mui/icons-material/FilterListRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";

export default function PhotoLibrary() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    const filteredPhotos = photosDummy.filter(photo =>
        photo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUpload = () => {
        alert("Add Photos functionality would open a file picker here.");
    };

    const toggleSelection = (id) => {
        const next = new Set(selectedIds);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelectedIds(next);
    };

    const toggleSelectionMode = () => {
        if (isSelectionMode) {
            setSelectedIds(new Set()); // Clear on exit
        }
        setIsSelectionMode(!isSelectionMode);
    };

    const handleDownload = () => {
        if (selectedIds.size === 0) return;
        alert(`Downloading ${selectedIds.size} selected photos.`);
    };

    return (
        <div className="photoPage">
            <div className="photoSurface">
                {/* Toolbar */}
                <div className="photoToolbar">
                    <div className="leftActions">
                        <span className="title">Photo Library</span>
                        <div className="search">
                            <SearchIcon className="searchIcon" />
                            <input
                                type="text"
                                placeholder="Search photos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>



                    <div className="rightActions">
                        <button
                            className={`actionBtn ${isSelectionMode ? 'active' : ''}`}
                            onClick={toggleSelectionMode}
                            title="Select Photos"
                        >
                            {isSelectionMode ? <CheckBoxRoundedIcon fontSize="small" style={{ color: 'var(--accent)' }} /> : <CheckBoxOutlineBlankRoundedIcon fontSize="small" />}
                            <span>Select</span>
                        </button>

                        <button
                            className="actionBtn"
                            onClick={handleDownload}
                            disabled={selectedIds.size === 0}
                            style={{ opacity: selectedIds.size === 0 ? 0.5 : 1 }}
                        >
                            <CloudDownloadRoundedIcon fontSize="small" />
                            <span>Download {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}</span>
                        </button>

                        <div className="v-divider" style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }}></div>

                        <button className="actionBtn" onClick={handleUpload}>
                            <AddRoundedIcon fontSize="small" style={{ color: 'var(--accent)' }} />
                            <span>Add Photos</span>
                        </button>
                    </div>
                </div>

                {/* Grid Content */}
                <div className="photoGrid">
                    {filteredPhotos.map((photo) => {
                        const isSelected = selectedIds.has(photo.id);
                        return (
                            <div
                                key={photo.id}
                                className={`photoCard ${isSelected ? 'selected' : ''}`}
                                title={photo.title}
                                onClick={() => isSelectionMode ? toggleSelection(photo.id) : null}
                                style={{ cursor: isSelectionMode ? 'pointer' : 'default' }}
                            >
                                <div className="imageWrap">
                                    <img src={photo.url} alt={photo.title} loading="lazy" />
                                </div>
                                <div className="info">
                                    <div className="title">{photo.title}</div>
                                    <div className="meta">
                                        <span>{photo.dimensions}</span>
                                        <span>{photo.size}</span>
                                    </div>
                                </div>

                                {isSelectionMode && (
                                    <div className="selectionOverlay" style={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        background: isSelected ? 'var(--accent)' : 'rgba(0,0,0,0.5)',
                                        borderRadius: '50%',
                                        width: 24,
                                        height: 24,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '2px solid white',
                                        transition: 'all 0.2s'
                                    }}>
                                        {isSelected && <CheckBoxRoundedIcon sx={{ color: 'white', fontSize: 16 }} />}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {filteredPhotos.length === 0 && (
                        <div style={{
                            gridColumn: '1 / -1',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            color: 'var(--muted)',
                            padding: '40px'
                        }}>
                            <p>No photos found matching "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
