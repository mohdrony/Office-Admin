import "./addressbook.scss";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/Key";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

export default function Addressbook() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const contacts = [
        { id: 1, name: "Alice Müller", role: "Architect", email: "alice.mueller@example.com", phone: "+49 170 1234567", org: "Studio A" },
        { id: 2, name: "Bob Schmidt", role: "Client", email: "bob.schmidt@clients.com", phone: "+49 170 9876543", org: "ImmoGroup" },
        { id: 3, name: "Charlie Davis", role: "Structural Engineer", email: "charlie@statics.de", phone: "+49 30 11223344", org: "Statics Berlin" },
        { id: 4, name: "Diana Rose", role: "Interior Designer", email: "diana@design.com", phone: "+49 160 5556667", org: "Rose Design" },
        { id: 5, name: "Login: Project X", role: "System Access", email: "admin@proj-x.com", phone: "N/A", org: "Internal" },
    ];

    const handleCreate = (type) => {
        setMenuOpen(false);
        console.log("Create", type);
        // Add creation logic or modal here
    };

    const pinnedContacts = contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="addressbookPage">
            <div className="addressbookSurface">
                <div className="topBar">
                    <div className="titleSection">
                        <h1>Addressbook</h1>
                        <div className="searchBar">
                            <SearchIcon />
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="actions">
                        <div className="createDropdownRoot">
                            <button
                                className="ghostBtn"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                <AddIcon fontSize="small" style={{ color: 'var(--accent)' }} />
                                <span>Add Entry</span>
                                <KeyboardArrowDownIcon fontSize="small" className={`chevron ${menuOpen ? 'open' : ''}`} />
                            </button>

                            {menuOpen && (
                                <>
                                    <div className="dropdownBackdrop" onClick={() => setMenuOpen(false)} />
                                    <div className="dropdownMenu">
                                        <div className="menuItem" onClick={() => handleCreate('Person')}>
                                            <PersonIcon fontSize="small" />
                                            <span>Person</span>
                                        </div>
                                        <div className="menuItem" onClick={() => handleCreate('Login Data')}>
                                            <KeyIcon fontSize="small" />
                                            <span>Login Data</span>
                                        </div>
                                        <div className="menuItem" onClick={() => handleCreate('Company')}>
                                            <BusinessIcon fontSize="small" />
                                            <span>Company</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="addressbookContent">
                    {pinnedContacts.map(contact => (
                        <div key={contact.id} className="contactItem">
                            <div className="leftInfo">
                                <div className="avatarPlaceholder">
                                    {getInitials(contact.name)}
                                </div>
                                <div className="textInfo">
                                    <span className="name">{contact.name}</span>
                                    <span className="role">{contact.role} — {contact.org}</span>
                                </div>
                            </div>

                            <div className="contactDetails">
                                <span className="detail">
                                    <EmailIcon fontSize="inherit" />
                                    {contact.email}
                                </span>
                                <span className="detail">
                                    <PhoneIcon fontSize="inherit" />
                                    {contact.phone}
                                </span>
                            </div>
                        </div>
                    ))}
                    {pinnedContacts.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--muted)', marginTop: '40px' }}>
                            No contacts found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
