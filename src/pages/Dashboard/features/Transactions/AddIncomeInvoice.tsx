import React, { useState } from 'react';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import TransactionToggle from './components/TransactionToggle';
import DatePicker from '../../../../components/ui/DatePicker';
import CustomDropdown from '../../components/CustomDropdown';
import PayerPayeeDropdown from './components/PayerPayeeDropdown';
import AddTenantModal from '../Tenants/components/AddTenantModal';

import { validateFile } from '../../../../utils/fileValidation';

const AddIncomeInvoice: React.FC = () => {
	const navigate = useNavigate();
	const [incomeType, setIncomeType] = useState<'property' | 'general'>('property');
	const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
	const [currency, setCurrency] = useState<string>('');
	const [isPaid, setIsPaid] = useState<boolean>(false);
	const [payerPayee, setPayerPayee] = useState<string>('');
	const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
	const [lease, setLease] = useState<string>('');
	const [showLeaseInput, setShowLeaseInput] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploadError, setUploadError] = useState<string>('');
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const location = useLocation();

	const handleFileClick = () => {
		setUploadError('');
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const validation = validateFile(file);
		if (!validation.isValid) {
			setUploadError(validation.error || 'Invalid file');
			return;
		}

		setSelectedFile(file);
		setUploadError('');
	};

	const handleCreate = () => {
		// Log data for now
		console.log({
			incomeType,
			dueDate,
			currency,
			isPaid,
			payerPayee,
			lease,
			file: selectedFile
		});
		// TODO: Implement API call
	};

	// Pre-fill data if passed from navigation state
	React.useEffect(() => {
		if (location.state?.prefilledPayer) {
			setPayerPayee(location.state.prefilledPayer.label);
		}
		if (location.state?.prefilledLease) {
			setLease(location.state.prefilledLease);
			setShowLeaseInput(true);
		}
		if (location.state?.prefilledDate) {
			setDueDate(location.state.prefilledDate);
		}
	}, [location.state]);

	return (
		<div className="p-4 sm:p-6 max-w-6xl mx-auto font-['Urbanist']">

			{/* Main Card */}
			<div className="bg-[#DFE5E3] rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-sm min-h-auto">
				{/* Header */}
				<div className="flex items-center mb-6">
					<button
						onClick={() => navigate(-1)}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<ChevronLeft className="w-6 h-6 text-gray-700" />
					</button>
					<h1 className="text-2xl font-bold text-gray-800">Income invoice</h1>
				</div>

				{/* Toggle */}
				<div className="mb-10">
					<TransactionToggle
						value={incomeType}
						onChange={(val) => setIncomeType(val as 'property' | 'general')}
						options={[
							{ label: 'Property Income', value: 'property' },
							{ label: 'General Income', value: 'general' }
						]}
					/>
				</div>

				{/* Form Fields */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
					{/* Category */}
					<div className="col-span-1 md:col-span-2">
						<label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Category & subcategory*</label>
						<div className="relative">
							<input
								type="text"
								placeholder="General Income"
								className="w-full rounded-md bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#84CC16]/20 transition-all shadow-sm"
							/>
						</div>
					</div>

					{/* Due on */}
					<div className="col-span-1">
						<label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Due on*</label>
						<div className="relative">
							<DatePicker value={dueDate} onChange={setDueDate} placeholder="Select due date" />
						</div>
					</div>

					{/* Amount */}
					<div className="col-span-1">
						<label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Amount*</label>
						<div className="relative">
							<input
								type="number"
								placeholder="0.00"
								className="w-full rounded-md bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#84CC16]/20 transition-all shadow-sm appearance-none"
							/>
						</div>
					</div>

					{/* Payer / Payee */}
					<div className="col-span-1 md:col-span-2">
						<label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Payer /Payee *</label>
						<div className="relative">
							<PayerPayeeDropdown
								value={payerPayee}
								onChange={setPayerPayee}
								options={[
									{ id: '1', label: 'Nihal Puse', type: 'Service Pro' },
									{ id: '2', label: 'Ojshav Saxena', type: 'tenant' },
								]}
								onAddTenant={() => setIsAddTenantModalOpen(true)}
							/>
						</div>
					</div>

					<AddTenantModal
						isOpen={isAddTenantModalOpen}
						onClose={() => setIsAddTenantModalOpen(false)}
						onSave={(data) => console.log('New Tenant Data:', data)}
					/>

					{/* Lease Field - Only shown when navigating from Tenant Detail */}
					{showLeaseInput && (
						<div className="col-span-1 md:col-span-2">
							<label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Lease</label>
							<div className="relative">
								<CustomDropdown
									value={lease}
									onChange={setLease}
									options={[
										{ value: 'Lease #101', label: 'Lease #101' },
										{ value: 'Lease #102', label: 'Lease #102' },
									]}
									placeholder="Select Lease"
									buttonClassName="!rounded-md"
								/>
							</div>
						</div>
					)}
					{/* Currency (Only for General Income) or Spacer */}
					{incomeType === 'general' ? (
						<div className="col-span-1 md:col-span-1">
							<label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Currency</label>
							<div className="relative">
								<CustomDropdown
									value={currency}
									onChange={setCurrency}
									options={[
										{ value: 'USD', label: 'USD' },
										{ value: 'EUR', label: 'EUR' },
										{ value: 'GBP', label: 'GBP' },
									]}
									placeholder="Select Currency"
									buttonClassName="!rounded-md"
								/>
							</div>
						</div>
					) : (
						<div className="hidden md:block col-span-2"></div>
					)}

					{/* Tags */}
					<div className="col-span-1 md:col-span-2">
						<label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Tags *</label>
						<div className="relative">
							<select className="w-full rounded-md bg-white px-4 py-3 text-sm text-gray-700 outline-none appearance-none shadow-sm focus:ring-2 focus:ring-[#84CC16]/20 cursor-pointer">
								<option value="" disabled selected>Tags</option>
								<option value="tag1">Tag 1</option>
								<option value="tag2">Tag 2</option>
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
								<ChevronDown className="w-4 h-4" />
							</div>
						</div>
					</div>
				</div>

				{/* Mark as paid toggle (below Tags) */}
				<div className="flex items-center gap-3 mb-10">
					<label className="inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							className="sr-only peer"
							checked={isPaid}
							onChange={(e) => setIsPaid(e.target.checked)}
						/>
						<div className={`w-12 h-7 rounded-full transition-colors duration-200 ${isPaid ? 'bg-[#84CC16]' : 'bg-gray-300'}`}>
							<div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 mt-1 ml-1 ${isPaid ? 'translate-x-5' : 'translate-x-0'}`} />
						</div>
					</label>
					<span className="text-sm font-medium text-gray-700">Mark as paid</span>
				</div>

				{/* Details */}
				<div className="mb-10">
					<h3 className="text-lg font-bold text-gray-800 mb-4">Details</h3>
					<textarea
						className="w-full h-40 rounded-2xl bg-[#F3F4F6] p-6 text-sm text-gray-700 outline-none resize-none shadow-inner focus:bg-white focus:ring-2 focus:ring-[#84CC16]/20 transition-all placeholder-gray-500"
						placeholder="Write Some details"
					></textarea>
				</div>

				{/* File Upload Error/Success Message */}
				{uploadError && (
					<div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
						{uploadError}
					</div>
				)}
				{selectedFile && !uploadError && (
					<div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
						File selected: {selectedFile.name}
					</div>
				)}

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-4">
					<input
						ref={fileInputRef}
						type="file"
						className="hidden"
						accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
						onChange={handleFileChange}
					/>
					<button
						onClick={handleFileClick}
						className="bg-[#84CC16] text-white px-8 py-3 rounded-md font-semibold shadow-lg shadow-[#84CC16]/20 hover:bg-[#65a30d] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
					>
						Upload File
					</button>
					<button
						onClick={handleCreate}
						className="bg-[#3D7475] text-white px-10 py-3 rounded-md font-semibold shadow-lg shadow-[#3D7475]/20 hover:bg-[#2c5556] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
					>
						Create
					</button>
				</div>

			</div>
		</div>
	);
};

export default AddIncomeInvoice;
