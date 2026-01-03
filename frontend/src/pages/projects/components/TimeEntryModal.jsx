// src/pages/projects/components/TimeEntryModal.jsx
import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem, Box, IconButton
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export default function TimeEntryModal({ open, onClose, onSave, project, entryToEdit }) {
    const isEdit = !!entryToEdit;

    // Form state
    const [phaseId, setPhaseId] = useState('');
    const [personId, setPersonId] = useState('');
    const [description, setDescription] = useState('');
    const [hours, setHours] = useState('');

    useEffect(() => {
        if (open) {
            if (isEdit) {
                // NOTE: In a real app we'd map entries to IDs. 
                // Here we just mock-fill text since dummy structure is loose
                setDescription(entryToEdit.description || '');
                setHours(entryToEdit.hour || '');
                // We try to find the person in the specific project list
                const p = project.persons.find(per => per.name === entryToEdit.person?.name);
                setPersonId(p ? p.id : (project.persons[0]?.id || ''));

                // Phase is trickier as entry doesn't strictly store phaseId in loose dummy.
                // We will just default to first phase or try to match by name if we passed it.
                const ph = project.phases.find(ph => ph.name === entryToEdit.phaseName);
                setPhaseId(ph ? ph.id : (project.phases[0]?.id || ''));
            } else {
                // Reset for new
                setPhaseId(project.phases?.[0]?.id || '');
                setPersonId(project.persons?.[0]?.id || '');
                setDescription('');
                setHours('');
            }
        }
    }, [open, isEdit, entryToEdit, project]);

    const handleSave = () => {
        onSave({
            phaseId,
            personId,
            description,
            hours: parseFloat(hours) || 0,
            isEdit
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                {isEdit ? 'Edit Time Entry' : 'Log Time'}
                <IconButton onClick={onClose} size="small"><CloseRoundedIcon /></IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={3} pt={1}>
                    <TextField
                        select
                        label="Phase"
                        value={phaseId}
                        onChange={e => setPhaseId(e.target.value)}
                        fullWidth
                    >
                        {project.phases?.map(ph => (
                            <MenuItem key={ph.id} value={ph.id}>
                                {ph.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Person"
                        value={personId}
                        onChange={e => setPersonId(e.target.value)}
                        fullWidth
                    >
                        {project.persons?.map(p => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="What did you work on?"
                        fullWidth
                        multiline
                        rows={2}
                    />

                    <TextField
                        label="Hours"
                        type="number"
                        value={hours}
                        onChange={e => setHours(e.target.value)}
                        fullWidth
                        inputProps={{ step: 0.5, min: 0 }}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={handleSave} variant="contained" disableElevation>
                    Save Entry
                </Button>
            </DialogActions>
        </Dialog>
    );
}
