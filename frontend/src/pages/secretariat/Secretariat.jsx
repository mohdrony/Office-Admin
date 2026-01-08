import { useState } from 'react';
import './secretariat.scss';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalculateIcon from '@mui/icons-material/Calculate';

export default function Secretariat() {
    const [activeTab, setActiveTab] = useState('all');
    const [menuOpen, setMenuOpen] = useState(false);

    const documents = [
        { id: 1, title: 'Invoice #2024-001 - Project Alpha', type: 'Invoice', date: 'Oct 24, 2024', status: 'paid', amount: '€4,500.00' },
        { id: 2, title: 'Offer - Client Beta Redesign', type: 'Offer', date: 'Oct 25, 2024', status: 'open', amount: '€12,000.00' },
        { id: 3, title: 'Timesheet - Oct Week 3', type: 'Timesheet', date: 'Oct 26, 2024', status: 'pending', amount: '40 hrs' },
        { id: 4, title: 'HOAI Calc - Stadtvilla K', type: 'Calculation', date: 'Oct 27, 2024', status: 'open', amount: 'LPH 1-4' },
    ];

    const handleCreate = (type) => {
        alert(`Create new ${type}`);
        setMenuOpen(false);
    };

    return (
        <div className="secretariatPage">
            <div className="secretariatSurface">
                <div className="topBar">
                    <h1>Sekretariat</h1>

                    <div className="actions">
                        <div className="createDropdownRoot">
                            <button
                                className="ghostBtn"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                <AddIcon fontSize="small" style={{ color: 'var(--accent)' }} />
                                <span>Create Document</span>
                                <KeyboardArrowDownIcon fontSize="small" className={`chevron ${menuOpen ? 'open' : ''}`} />
                            </button>

                            {menuOpen && (
                                <>
                                    <div className="dropdownBackdrop" onClick={() => setMenuOpen(false)} />
                                    <div className="dropdownMenu">
                                        <div className="menuItem" onClick={() => handleCreate('Offer')}>
                                            <DescriptionIcon fontSize="small" />
                                            <span>Offer</span>
                                        </div>
                                        <div className="menuItem" onClick={() => handleCreate('Invoice')}>
                                            <ReceiptLongIcon fontSize="small" />
                                            <span>Invoice</span>
                                        </div>
                                        <div className="menuItem" onClick={() => handleCreate('Timesheet')}>
                                            <AccessTimeIcon fontSize="small" />
                                            <span>Timesheet</span>
                                        </div>
                                        <div className="menuDivider" />
                                        <div className="menuItem" onClick={() => handleCreate('HOAI Calculation')}>
                                            <CalculateIcon fontSize="small" />
                                            <span>HOAI Calculation</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="secretariatContent">
                    <div className="section">
                        <h2>Quick Stats (HOAI & Operations)</h2>
                        <div className="hoaiCalc">
                            <div className="statCard">
                                <div className="label">Open Offers</div>
                                <div className="value">€24,500</div>
                            </div>
                            <div className="statCard">
                                <div className="label">Invoiced (This Month)</div>
                                <div className="value">€12,800</div>
                            </div>
                            <div className="statCard">
                                <div className="label">Billable Hours</div>
                                <div className="value">142.5 hrs</div>
                            </div>
                            <div className="statCard">
                                <div className="label">Pending Payroll</div>
                                <div className="value">Due in 4 days</div>
                            </div>
                        </div>
                    </div>

                    <div className="section">
                        <h2>Recent Documents</h2>
                        <div className="documentList">
                            {documents.map(doc => (
                                <div key={doc.id} className="docItem">
                                    <div className="docInfo">
                                        <span className="title">{doc.title}</span>
                                        <span className="meta">{doc.type} • {doc.date}</span>
                                    </div>
                                    <div className="rightSide">
                                        <span style={{ marginRight: '16px', fontWeight: '600' }}>{doc.amount}</span>
                                        <span className={`docStatus ${doc.status}`}>{doc.status.toUpperCase()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
