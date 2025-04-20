
export const formatDate = (dateString: string | null) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit', 
    day: '2-digit', 
    year: '2-digit'
  }).format(date);
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    currencyDisplay: 'symbol',
  }).format(amount).replace('PHP', '₱');
};

export const getTypeColor = (type: string) => {
  switch (type) {
    case 'Complete':
      return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-50';
    case 'Eye Exam':
      return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50';
    case 'Frame Replacement':
      return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50';
    case 'Lens Replacement':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50';
    case 'Medical Certificate':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50';
    case 'Contact Lens':
      return 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-50';
    case 'Repair':
      return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50';
    case 'Return':
      return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-50';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50';
  }
};
