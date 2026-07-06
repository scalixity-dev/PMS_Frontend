import React, { useState } from 'react';
import BaseModal from '../../../../components/common/modals/BaseModal';
import { useToast } from '../../../../components/common/Toast';
import { demoRequestService } from '../../../../services/demoRequest.service';

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_LEN = 50;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(?=(?:.*\d){7,})[+0-9\s\-().]{7,20}$/;

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  numberOfUnits?: string;
}

const DemoRequestModal: React.FC<DemoRequestModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [numberOfUnits, setNumberOfUnits] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setCompanyName('');
    setNumberOfUnits('');
    setErrors({});
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!firstName.trim()) next.firstName = 'First name is required';
    if (!lastName.trim()) next.lastName = 'Last name is required';
    if (!email.trim()) next.email = 'Email is required';
    else if (!EMAIL_REGEX.test(email.trim())) next.email = 'Please enter a valid email address';
    if (!phone.trim()) next.phone = 'Phone number is required';
    else if (!PHONE_REGEX.test(phone.trim())) next.phone = 'Please enter a valid phone number';
    if (!companyName.trim()) next.companyName = 'Company name is required';
    if (!numberOfUnits.trim()) next.numberOfUnits = 'Number of units is required';
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      await demoRequestService.submit({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        companyName: companyName.trim(),
        numberOfUnits: numberOfUnits.trim(),
      });
      toast.success("Thanks! We've received your request and will reach out shortly.");
      resetForm();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send your demo request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const baseInputClass =
    'w-full bg-white rounded-lg px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-emerald-400';
  const getInputClass = (field: keyof FormErrors) =>
    `${baseInputClass} ${errors[field] ? 'border-red-400' : 'border-gray-200'}`;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Request a demo" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value.slice(0, MAX_LEN))}
              placeholder="Name"
              className={getInputClass('firstName')}
            />
            {errors.firstName ? (
              <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">{firstName.length} of {MAX_LEN} max characters</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value.slice(0, MAX_LEN))}
              placeholder="Last Name"
              className={getInputClass('lastName')}
            />
            {errors.lastName ? (
              <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">{lastName.length} of {MAX_LEN} max characters</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={getInputClass('email')}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Number"
              className={getInputClass('phone')}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value.slice(0, MAX_LEN))}
              placeholder="Company"
              className={getInputClass('companyName')}
            />
            {errors.companyName ? (
              <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">{companyName.length} of {MAX_LEN} max characters</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of units *</label>
            <input
              type="number"
              min={0}
              value={numberOfUnits}
              onChange={(e) => setNumberOfUnits(e.target.value)}
              placeholder="Number of units"
              className={getInputClass('numberOfUnits')}
            />
            {errors.numberOfUnits && <p className="text-xs text-red-500 mt-1">{errors.numberOfUnits}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 mx-auto bg-[#7CA96F] hover:bg-[#6b9860] text-white font-semibold py-3 px-10 rounded-full shadow-md transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </BaseModal>
  );
};

export default DemoRequestModal;
