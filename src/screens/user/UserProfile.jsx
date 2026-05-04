import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import fetchData from '../../Backend/fetchData.backend';
import ActivityCard from '../../components/user/userProfile/ActivityCard';
import ProfileCard from '../../components/user/userProfile/ProfileCard';
import BasicCardContent from '../../components/user/userProfile/components/BasicCardContent';
import ComponentHeader from '../../components/ComponentHeader';
import { headerLink_userProfile } from './helper';
import AssignRoleForm from '../../components/user/userProfile/AssignRole.form';
import AddModal from '../../components/Add.modal';


const UserProfile = () => {
    const { id } = useParams();
    const [roles, setRoles] = useState([]);
    const [locations, setLocations] = useState([]);
    const [details, setDetails] = useState({});
    const [isShowAssignRoleForm, setIsShowAssignRoleForm] = useState(false);

    const { data: userDetails, isLoading, refetch } = fetchData.TQAllUserList({ id }, !!id);

    useEffect(() => {
        setDetails(userDetails?.data ?? {});
        setLocations(userDetails?.data?.userBusinessNode ?? []);
        setRoles(userDetails?.data?.roles ?? []);
    }, [isLoading, userDetails])

    return (
        <div>
            <ComponentHeader
                headerLink={headerLink_userProfile}
                showSearch={false}
            />

            <div className="pt-5">
                {/* first row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:sm:grid-cols-3 gap-5 mb-5">
                    <ProfileCard
                        data={details}
                    />

                    {/* Role section */}
                    <ActivityCard
                        cardTitle='Assigned Roles'
                        buttonTitle='Add / Remove Role'
                        btnOnClick={() => setIsShowAssignRoleForm(true)}
                    >
                        {roles?.length > 0 ?
                            <>{
                                roles?.map((role, idx) =>
                                    <BasicCardContent
                                        key={idx}
                                        primaryText={role?.role}
                                        secondaryText={role?.status}
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

            <AddModal
                title="Assign Role"
                isShow={isShowAssignRoleForm}
                setIsShow={setIsShowAssignRoleForm}
                maxWidth="50"
            >
                <AssignRoleForm
                    setIsShow={setIsShowAssignRoleForm}
                    userId={id}
                    onSuccess={() => refetch()}
                />
            </AddModal>
        </div>
    )
}

export default UserProfile