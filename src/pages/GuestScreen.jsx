import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { db } from "../services/FirebaseServices";
import NavBarComponent from "../components/NavbarComponent";
import { CollapsibleTable } from "../components/CollapsibleTableComponent";

const GuestScreen = ({ onSignOut }) => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const snapshot = await db.collection('hardware').get();
            const docsArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDocuments(docsArray);
        }

        fetchData();
    }, []);

    return (
        <div>
            <NavBarComponent onSignOut={onSignOut} />
            <CollapsibleTable rows={documents} />
        </div>
    )
}

GuestScreen.propTypes = {
    onSignOut: PropTypes.func.isRequired,
};

export default GuestScreen;