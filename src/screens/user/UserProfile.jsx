import React from 'react'
import { Link } from 'react-router-dom'
import ProfileCard from '../../components/user/userProfile/ProfileCard'

const UserProfile = () => {
    return (
        <div>
            <ul className="flex space-x-2">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Users
                    </Link>
                </li>
                <li className="before:content-['/'] before:mr-2">
                    <span>Profile</span>
                </li>
            </ul>

            <div className="pt-5">
                {/* first row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-5">
                    <ProfileCard />
                </div>
            </div>
        </div>
    )
}

export default UserProfile