export class CreateHotelDto {
  name: string;
  rating: number;
  pricePerNight: string;
  destination: string;
  lateCheckInAvailable?: boolean;
}
