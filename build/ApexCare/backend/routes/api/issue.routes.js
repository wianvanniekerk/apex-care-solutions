const express = require('express');
const router = express.Router();
const ManageJobs = require('../../controller/ManageJobs');
const { sendSMS } = require('../../services/VonageAPI');

const jobManager = new ManageJobs();

router.get('/clients/:id', async (req, res) => {
    try {
        const clientDetails = await jobManager.getClientDetails(req.params.id);
        return res.json(clientDetails);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get('/technicians/:id', async (req, res) => {
    try {
        const technicianDetails = await jobManager.getTechnicianDetails(req.params.id);
        return res.json(technicianDetails);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get('/serviceAgreements/:id', async (req,res) => {
    try{
        const serviceAgreements = await jobManager.getServiceAgreements(req.params.id);
        return res.json(serviceAgreements);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/add-job', async (req, res) => {
    const { TechnicianID, ClientID, Title, Description, Address, Status, Priority, Equipment } = req.body;

    if (!TechnicianID || !ClientID || !Title || !Description || !Address || !Status || !Priority || !Equipment) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const jobData = {
            technician: TechnicianID,
            client: ClientID,
            title: Title,
            description: Description,
            address: Address,
            status: Status,
            priority: Priority,
            equipment: Equipment
        };

        const newJob = await jobManager.createJob(jobData);

        const smsText = `New job: \nTitle: ${Title}\nDescription: ${Description}\nAddress: ${Address}\nPriority: ${Priority} \nEquipment: ${Equipment}`;
        //comment this out if you want to test with the db and not send sms's the whole time and exceed our limit of sms's on the free version of Vonage
        //await sendSMS(smsText);   //send sms

        res.json({ message: `Job added successfully: ${Title}`, job: newJob });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;