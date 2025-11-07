import { CheckCircleIcon, CheckedCircleIcon, HelpCircleIcon } from "../../../components/AuthIcons";

interface FormData {
  accountType?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  country?: string;
  city?: string;
  pincode?: string;
  address?: string;
  password?: string;
  confirmPassword?: string;
  agreedToTerms?: boolean;
}

interface AccountType {
  id: string;
  title: string;
  subtitle: string;
  type: string;
}

interface AccountTypeSelectionProps {
  onNext: () => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export const AccountTypeSelection: React.FC<AccountTypeSelectionProps> = ({ onNext, formData, setFormData }) => {
  const accountTypes: AccountType[] = [
    { id: 'renting', title: "I'm renting", subtitle: 'PMS', type: 'Free account' },
    { id: 'manage', title: 'I manage rentals', subtitle: 'Property Manager', type: 'Start 14-days trail' },
    { id: 'fix', title: 'I fix rentals', subtitle: 'Service Pro', type: 'Free account' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-4xl mx-auto">
        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-center mb-2">Account type</h1>
          <p className="text-center text-gray-600 mb-12">Choose the user account type that suits your needs.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {accountTypes.map((account) => {
              const isSelected = formData.accountType === account.id;

              let cardClass = 'relative p-6 rounded-lg cursor-pointer transition border-2 flex flex-col items-center text-center h-full min-h-[220px]';
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
                  <div className="flex justify-between items-start w-full mb-6">
                    <span className={typeClass}>{account.type}</span>
                    <HelpCircleIcon className={helpIconClass} />
                  </div>
                  
                  {/* Middle Row: Checkmark Icon (or placeholder space) */}
                  <div className="w-12 h-12 mb-6 flex items-center justify-center">
                    {isSelected ? (
                        <CheckedCircleIcon className="w-16 h-16" />
                    ) : (
                        <CheckCircleIcon className="w-16 h-16" />
                    )}
                  </div>

                  {/* Bottom Row: Title & Subtitle (pushed to bottom) */}
                  <div className="m-auto">
                    <h3 className="text-lg font-semibold mb-1">{account.title}</h3>
                    <p className={subtitleClass}>{account.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mb-8">
            <p className="text-sm text-gray-600">
              I'm a <span className="text-teal-500 font-medium cursor-pointer">Property Owner</span>. My properties are managed by Property Managers.
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onNext}
              disabled={!formData.accountType}
              className="px-8 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};