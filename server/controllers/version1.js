import script from '../controllers/version1.js';

const getShorterPath = (req, res) => {
    const data = req.body;
    const depart = data.depart;
    const arrivee = data.arrivee;
    try {
        const path = script.getShorterPath(depart, arrivee);
        res.status(200).json({ path });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
}

const getAllStations = (req, res) => {
    try {
        const stations = script.getAllStations();
        res.status(200).json({ stations });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the stations.' });
    }
}