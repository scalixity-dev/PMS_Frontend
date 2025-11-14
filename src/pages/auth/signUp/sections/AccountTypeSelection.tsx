import { Link } from "react-router-dom";
import { CheckCircleIcon, CheckedCircleIcon, HelpCircleIcon } from "../../../../components/AuthIcons";
import type { AccountType, AccountTypeSelectionProps } from "./signUpProps";

export const AccountTypeSelection: React.FC<AccountTypeSelectionProps> = ({ onNext, formData, setFormData }) => {
  const accountTypes: AccountType[] = [
    { id: 'renting', title: "I'm renting", subtitle: 'PMS', type: 'Free account' },
    { id: 'manage', title: 'I manage rentals', subtitle: 'Property Manager', type: 'Start 14-days trail' },
    { id: 'fix', title: 'I fix rentals', subtitle: 'Service Pro', type: 'Free account' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-white">
      <div className="w-full max-w-4xl mx-auto">
        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">Account type</h1>
          <p className="text-center text-gray-600 mb-8 sm:mb-10 md:mb-12 text-sm sm:text-base">Choose the user account type that suits your needs.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-7 md:mb-8">
            {accountTypes.map((account) => {
              const isSelected = formData.accountType === account.id;

              let cardClass = 'relative p-4 sm:p-5 md:p-6 rounded-lg cursor-pointer transition border-2 flex flex-col items-center text-center h-full min-h-[180px] sm:min-h-[200px] md:min-h-[220px]';
              let typeClass = 'text-xs text-gray-600';
              let helpIconClass = 'text-gray-400';
              let subtitleClass = 'text-sm text-gray-600';

              if (isSelected) {
                cardClass += ' bg-[#11DE9B] border-[#11DE9B] text-white';
                typeClass = 'text-xs text-white opacity-90';
                helpIconClass = 'text-white opacity-90';
                subtitleClass = 'text-sm text-white opacity-90';
              } else {
                cardClass += ' bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100';
              }

              return (
                <div
                  key={account.id}
                  onClick={() => setFormData({ ...formData, accountType: account.id })}
                  className={cardClass}
                >
                  {/* Top Row: Account Type & Help Icon */}
                  <div className="flex justify-between items-start w-full mb-4 sm:mb-5 md:mb-6">
                    <span className={typeClass}>{account.type}</span>
                    <HelpCircleIcon className={`${helpIconClass} w-4 h-4 sm:w-5 sm:h-5`} />
                  </div>
                  
                  {/* Middle Row: Checkmark Icon (or placeholder space) */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mb-4 sm:mb-5 md:mb-6 flex items-center justify-center">
                    {isSelected ? (
                        <CheckedCircleIcon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" />
                    ) : (
                        <CheckCircleIcon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" />
                    )}
                  </div>

                  {/* Bottom Row: Title & Subtitle (pushed to bottom) */}
                  <div className="m-auto">
                    <h3 className="text-base sm:text-lg font-semibold mb-1">{account.title}</h3>
                    <p className={subtitleClass}>{account.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mb-6 sm:mb-7 md:mb-8">
            <p className="text-xs sm:text-sm text-gray-600 px-2">
              I'm a <span className="text-teal-500 font-medium cursor-pointer">Property Owner</span>. My properties are managed by Property Managers.
            </p>
          </div>
          

          <div className="flex justify-center">
            <button
              onClick={onNext}
              disabled={!formData.accountType}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm sm:text-base"
            >
              Next
            </button>
          </div>
          <div className="mt-3 sm:mt-2 text-center text-xs sm:text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-(--color-primary) hover:text-green-600 hover:underline">
                Sign In
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};