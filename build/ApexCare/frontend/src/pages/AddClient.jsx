import React, { useState, useEffect } from 'react';
import { Typography } from "@mui/material";
import plusIcon from "../assets/plus.png";
import apexcare2 from "../assets/apexcare-2.png";

const AddClient = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        contact: '',
        isKeyClient: 'yes',
        password: 'none'
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
        setLoading(true);
        setError(null);

        const submissionData = {
            ...formData,
            isKeyClient: formData.isKeyClient === 'yes' ? 1 : 0
        };

        try {
            const response = await fetch('http://localhost:8081/client-management/add-client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            setFormData({
                name: '',
                email: '',
                address: '',
                contact: '',
                isKeyClient: 'yes'
            });

            window.location.href = '/client-management';

        } catch (err) {
            setError(err.message);
            console.error('Error adding client:', err);
        } finally {
            setLoading(false);
        }
    };

    return (    
        <div className="add-client-container">
            <header className="header">
                <div className="logoBox">
                    <a href="/home">
                        <img className="apexcare" alt="ApexCare" src={apexcare2} />
                    </a>
                    <Typography variant="h4" className="Title">Add Client</Typography>
                </div>
            </header>
           
            {error && (
                <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}
           
            <form onSubmit={handleSubmit} className="add-client-form">
                <div className='add-client-field'>
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
                <div className='add-client-field'>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='add-client-field'>
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='add-client-field'>
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
                <div className='add-client-field'>
                    <label htmlFor="isKeyClient">Is Key Client?</label>
                    <div>
                        <input
                            type="radio"
                            id="isKeyClientYes"
                            name="isKeyClient"
                            value="yes"
                            checked={formData.isKeyClient === 'yes'}
                            onChange={handleInputChange}
                            className="keyClient"
                        />
                        <label htmlFor="isKeyClientYes">Yes</label>
                       
                        <input
                            type="radio"
                            id="isKeyClientNo"
                            name="isKeyClient"
                            value="no"
                            checked={formData.isKeyClient === 'no'}
                            onChange={handleInputChange}
                            className="keyClient"
                        />
                        <label htmlFor="isKeyClientNo">No</label>
                    </div>
                </div>
               
                <button 
                    type="submit" 
                    className="add-client-sumbit"
                    disabled={loading}
                >
                    <img className="plus-icon" alt="Plus" src={plusIcon} />
                    <p>{loading ? 'Adding...' : 'Add Client'}</p>
                </button>    
            </form>          
        </div>
    );
}

export default AddClient;