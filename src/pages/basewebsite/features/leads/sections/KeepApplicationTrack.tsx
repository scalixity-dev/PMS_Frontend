// components/KeepApplicationTrack.tsx
import { UserCheck, NotepadText, UserPlus, Phone } from "lucide-react";
import ViewMoreButton from "../../../../../components/common/buttons/ViewMoreButton";

export default function KeepApplicationTrack() {
  const cards = [
    {
      icon: <UserCheck className="w-6 h-6 md:w-8 md:h-8 lg:w-8 lg:h-8" />,
      title: "Change lead status and convert leads into Pms.",
      bgColor: "bg-white hover:bg-[#8FB299]",
      textColor: "text-[var(--color-primary)] group-hover:text-white"
    },
    {
      icon: <NotepadText className="w-6 h-6 md:w-8 md:h-8 lg:w-8 lg:h-8" />,
      title: "Add notes and files for future references.",
      bgColor: "bg-white hover:bg-[#8FB299]",
      textColor: "text-[var(--color-primary)] group-hover:text-white"
    },
    {
      icon: <UserPlus className="w-6 h-6 md:w-8 md:h-8 lg:w-8 lg:h-8" />,
      title: "Assign leads to your team members and create tasks;",
      bgColor: "bg-white hover:bg-[#8FB299]",
      textColor: "text-[var(--color-primary)] group-hover:text-white"
    },
    {
      icon: <Phone className="w-6 h-6 md:w-8 md:h-8 lg:w-8 lg:h-8" />,
      title: "Log calls and meetings to keep track of every lead.",
      bgColor: "bg-white hover:bg-[#8FB299]",
      textColor: "text-[var(--color-primary)] group-hover:text-white"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto py-8 px-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-stretch">
        {/* Left Side Box */}
        <div
          className="flex flex-col rounded-lg p-10 w-full h-full space-y-6 bg-[#F6FFF3]"
        >
          <div>
            <h2 className="text-black text-3xl md:text-4xl font-semibold font-[var(--font-heading)] mb-6 leading-snug">
              Keep track of every application with powerful tools
            </h2>
            <p className="text-gray-700 text-base max-w-sm mb-4">
              After a potential Pms  is added to the CRM, you can easily follow their journey:
            </p>
            <div className="mt-4">
              <ViewMoreButton to="/features/screening" />
            </div>
          </div>
        </div>

        {/* Right Side Cards */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-6 w-full h-full">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`group ${card.bgColor} rounded-2xl p-6 md:p-8 lg:p-8 flex flex-col justify-between h-full shadow-sm border border-gray-200 transition-all duration-300 ease-in-out cursor-pointer`}
            >
              <div className="flex flex-col gap-6">
                <div className={card.textColor}>
                  {card.icon}
                </div>
                <h3 className={`${card.textColor} text-base font-medium leading-snug`}>
                  {card.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
