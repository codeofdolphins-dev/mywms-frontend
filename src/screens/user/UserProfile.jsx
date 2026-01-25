import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProfileCard from '@/components/user/userProfile/ProfileCard'
import ActivityCard from '@/components/user/userProfile/ActivityCard';
import BasicCardContent from '@/components/user/userProfile/components/BasicCardContent';
import fetchData from '@/Backend/fetchData.backend';

const UserProfile = () => {
    const { id } = useParams();
    const [roles, setRoles] = useState([]);
    const [locations, setLocations] = useState([]);
    const [details, setDetails] = useState({});

    const { data: userDetails, isLoading } = fetchData.TQAllUserList({ id }, !!id);

    // console.log(userDetails?.data?.[0]);
    // console.log(roles);
    // console.log(locations);

    useEffect(() => {
        setDetails(userDetails?.data ?? {});
        setLocations(userDetails?.data?.userBusinessNode ?? []);
        setRoles(userDetails?.data?.roles ?? []);
    }, [isLoading])

    return (
        <div>
            {/* breadcrumb */}
            <ul className="flex space-x-2">
                <li>
                    <Link to="/user" className="text-primary hover:underline">
                        Users
                    </Link>
                </li>
                <li className="before:content-['/'] before:mr-2">
                    <span>Profile</span>
                </li>
            </ul>

            <div className="pt-5">
                {/* first row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:sm:grid-cols-3 gap-5 mb-5">
                    <ProfileCard
                        data={details}
                    />

                    {/* Role section */}
                    <ActivityCard
                        cardTitle='Assigned Roles'
                        buttonTitle='Add Role'
                    >
                        {roles?.length > 0 ?
                            <>{
                                roles?.map((role, idx) =>
                                    <BasicCardContent
                                        key={idx}
                                    />
                                )
                            }
                            </> : <>
                                <div className="p-6 text-center text-gray-400">
                                    No role assign yet
                                </div>
                            </>
                        }
                    </ActivityCard>

                    {/* assign location section */}
                    <ActivityCard
                        cardTitle='Assigned Locations'
                        buttonTitle='Assign'
                    >
                        {locations?.length > 0 ?
                            <> {
                                locations?.map((location, idx) => {
                                    const role = location?.NodeUser?.userRole === "NODE_ADMIN" ? "Location Admin" : "Location User";
                                    const details = location?.nodeDetails;

                                    return (
                                        <BasicCardContent
                                            key={idx}
                                            isBadge={true}
                                            badgeText={role}
                                            primaryText={`Name: ${details?.name}`}
                                            secondaryText={`Location: ${location?.name}`}
                                        />
                                    )
                                })
                            } </> : <>
                                <div className="p-6 text-center text-gray-400">
                                    Not assign to any location
                                </div>
                            </>
                        }
                    </ActivityCard>
                </div>
            </div>
        </div>
    )
}

export default UserProfile