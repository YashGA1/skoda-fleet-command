import { Location, LocationCode } from '@/types/auth';

export const LOCATIONS: Location[] = [
  {
    code: 'PTC',
    name: 'Pune',
    fullName: 'Pune Training Center'
  },
  {
    code: 'VGTAP',
    name: 'VGTAP',
    fullName: 'VGTAP Training Center'
  },
  {
    code: 'NCR',
    name: 'NCR',
    fullName: 'NCR Training Center'
  },
  {
    code: 'BLR',
    name: 'Bangalore',
    fullName: 'Bangalore Training Center'
  }
];

export const getLocationName = (code: LocationCode): string => {
  if (code === 'ALL') return 'All Locations';
  const location = LOCATIONS.find(l => l.code === code);
  return location?.fullName || code;
};
