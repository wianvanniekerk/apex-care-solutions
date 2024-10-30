import React, { useState, useEffect } from 'react';
import { Typography } from "@mui/material";
import plusIcon from "../assets/plus.png";
import apexcare2 from "../assets/apexcare-2.png";

const AddTechnician = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '', 
        expertise: '', 
        area: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
    
        try {
            const response = await fetch('http://localhost:8081/technicians/add-technician', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                setError(data.error);
                return;
            }

            setFormData({
                name: '',
                email: '',
                contact: '',
                expertise: '',
                area: ''
            });
            
            window.location.href = '/technicians';
            
        } catch (err) {
            setError('Network error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (    
        <div className="add-technician-container">
            <header className="header">
                <div className="logoBox">
                    <a href="/home">
                        <img className="apexcare" alt="ApexCare" src={apexcare2} />
                    </a>
                    <Typography variant="h4" className="Title">Add Technician</Typography>
                </div>
            </header>
           
            {error && (
                <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}
           
            <form onSubmit={handleSubmit} className="add-technician-form">
                <div className='add-technician-field'>
                    <label htmlFor="name">Full Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className='add-technician-field'>
                    <label htmlFor="name">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
               
                <div className='add-technician-field'>
                    <label htmlFor="contact">Contact:</label>
                    <input
                        type="text"
                        id="contact"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className='add-technician-field'>
                    <label htmlFor="expertise">Expertise:</label>
                    <input
                        type="text"
                        id="expertise"
                        name="expertise"
                        value={formData.expertise}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className='add-technician-field'>
                    <label htmlFor="area">Area:</label>
                    <input
                        type="text"
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        required
                    />
                </div>
               
                <button 
                    type="submit" 
                    className="add-technician-sumbit"
                    disabled={loading}
                >
                    <img className="plus-icon" alt="Plus" src={plusIcon} />
                    <p>{loading ? 'Adding...' : 'Add Client'}</p>
                </button>    
            </form>          
        </div>
    );
}

export default AddTechnician;