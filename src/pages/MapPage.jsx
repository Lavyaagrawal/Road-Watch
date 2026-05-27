import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getIssues } from "../services/localIssueService";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function MapPage() {
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        const fetchIssues = async () => {
            const data = await getIssues();
            setIssues(data);
        };

        fetchIssues();
    }, []);

    return (

        <Layout>

            <div className="
        h-[90vh]
        p-6
      ">

                <MapContainer
                    center={[18.5204, 73.8567]}
                    zoom={12}
                    className="
          h-full
          w-full
          rounded-3xl
          overflow-hidden
          shadow-2xl
          border
          border-slate-800
          "
                >

                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {issues.map(issue => (

                        <Marker
                            key={issue.id}
                            position={[
                                issue.latitude,
                                issue.longitude
                            ]}
                        >

                            <Popup>

                                <div className="w-52">

                                    <img
                                        src={issue.imageUrl}
                                        alt=""
                                        className="
                    w-full
                    h-32
                    object-cover
                    rounded-xl
                    mb-3
                    "
                                    />

                                    <h2 className="
                    text-lg
                    font-bold
                    mb-2
                  ">
                                        {issue.type}
                                    </h2>

                                    <p className="text-sm">
                                        {issue.description}
                                    </p>

                                </div>

                            </Popup>

                        </Marker>

                    ))}

                </MapContainer>

            </div>

        </Layout>

    );
}

export default MapPage;