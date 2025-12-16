import React from 'react'
import { MdCategory } from "react-icons/md";
import { GoTag } from "react-icons/go";
import { BsBoxSeam } from "react-icons/bs";
import { LuWarehouse } from "react-icons/lu";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaTruckRampBox } from "react-icons/fa6";
import { TbCircleDottedLetterN } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';


const icons: Record<string, any> = {
  category: MdCategory,
  brand: GoTag,
  product: BsBoxSeam,
  warehouse: LuWarehouse,
  hsn: IoDocumentTextOutline,
  supplier: FaTruckRampBox,
};

type MasterCardProps = {
  title?: string;
  description?: string;
  icon?: string;
  color?: string;
  link?: string;
};

const MasterCard: React.FC<MasterCardProps> = ({
  title = "dummy title",
  description = "dummy description",
  icon,
  color = "bg-blue-500",
  link,
}) => {

  const Icon: any = icons[icon || ""] || TbCircleDottedLetterN;
  const navigate = useNavigate();

    return (
        <div
            className="flex items-center justify-center text-center cursor-pointer hover:scale-[1.05] transition-transform duration-200"
            onClick={() => navigate(link || "#")}
        >
            <div className="h-[15rem] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light">
                <div className="flex flex-col items-center justify-center py-7 px-6">
                    <div className={`mb-5 inline-block p-3 text-[#f1f2f3] rounded-full ${color}`}>
                        <Icon
                            size={35}
                        />
                    </div>
                    <h5 className="text-[#3b3f5c] text-xl font-semibold mb-4">{title}</h5>
                    <p className="text-white-dark">{description}</p>
                </div>
            </div>
        </div>
    )
}

export default MasterCard
