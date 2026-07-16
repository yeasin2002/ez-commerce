export interface MockOrder {
  id: string;
  date: string;
  status: "Delivered" | "Shipped" | "Processing" | "Cancelled" | "Refunded";
  itemCount: number;
  total: number;
  items: {
    name: string;
    size: string;
    color: string;
    qty: number;
    price: number;
    image: string;
  }[];
  timeline: {
    status: string;
    date: string;
    description: string;
    done: boolean;
  }[];
}

export interface MockAddress {
  id: string;
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
  type: "shipping" | "billing" | "home";
}

export const mockCustomerProfile = {
  fullName: "Rifat Ahmed",
  email: "rifat.ahmed@example.com",
  phone: "+880 1712 345 678",
  dateJoined: "12 January 2024",
  dateOfBirth: "1998-01-12",
  gender: "male",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
};

export const mockOrders: MockOrder[] = [
  {
    id: "EZC-2505-0012",
    date: "12 May 2025",
    status: "Delivered",
    itemCount: 3,
    total: 4250,
    items: [
      {
        name: "Manchester United Home Jersey 2024/25",
        size: "M",
        color: "Red",
        qty: 1,
        price: 2450,
        image: "/mock-jersey-red.png"
      },
      {
        name: "Nike Dri-FIT Short Men's Shorts",
        size: "M",
        color: "Black",
        qty: 1,
        price: 950,
        image: "/mock-shorts-black.png"
      },
      {
        name: "Adidas Training Socks",
        size: "L",
        color: "White",
        qty: 2,
        price: 850,
        image: "/mock-socks-white.png"
      }
    ],
    timeline: [
      { status: "Order Placed", date: "12 May 2025, 10:24 AM", description: "Your order has been successfully placed.", done: true },
      { status: "Payment Confirmed", date: "12 May 2025, 10:25 AM", description: "Payment was successfully processed via Cash on Delivery.", done: true },
      { status: "Order Processed", date: "13 May 2025, 09:12 AM", description: "Your package is prepared and ready for shipment.", done: true },
      { status: "Shipped", date: "14 May 2025, 03:40 PM", description: "Carrier has picked up package. Tracking ID: TRK125467890", done: true },
      { status: "Delivered", date: "16 May 2025, 11:15 AM", description: "Package was delivered to the shipping address.", done: true }
    ]
  },
  {
    id: "EZC-2505-0009",
    date: "5 May 2025",
    status: "Delivered",
    itemCount: 2,
    total: 2850,
    items: [
      {
        name: "Inter Miami Away Jersey 2024/25",
        size: "L",
        color: "Pink",
        qty: 1,
        price: 2150,
        image: "/mock-jersey-pink.png"
      },
      {
        name: "Team Classic Training Cap",
        size: "One Size",
        color: "Black",
        qty: 1,
        price: 700,
        image: "/mock-cap-black.png"
      }
    ],
    timeline: [
      { status: "Order Placed", date: "05 May 2025, 02:10 PM", description: "Your order has been successfully placed.", done: true },
      { status: "Payment Confirmed", date: "05 May 2025, 02:12 PM", description: "Payment was successfully processed.", done: true },
      { status: "Order Processed", date: "06 May 2025, 08:30 AM", description: "Your package is prepared.", done: true },
      { status: "Shipped", date: "07 May 2025, 01:15 PM", description: "Carrier has picked up package.", done: true },
      { status: "Delivered", date: "09 May 2025, 04:30 PM", description: "Package was delivered.", done: true }
    ]
  },
  {
    id: "EZC-2504-0032",
    date: "28 Apr 2025",
    status: "Shipped",
    itemCount: 1,
    total: 1350,
    items: [
      {
        name: "Barcelona Retro 1998/99 Home Jersey",
        size: "M",
        color: "Blue/Red",
        qty: 1,
        price: 1350,
        image: "/mock-jersey-fcb.png"
      }
    ],
    timeline: [
      { status: "Order Placed", date: "28 Apr 2025, 11:00 AM", description: "Your order has been successfully placed.", done: true },
      { status: "Payment Confirmed", date: "28 Apr 2025, 11:05 AM", description: "Payment was successfully processed.", done: true },
      { status: "Order Processed", date: "29 Apr 2025, 09:00 AM", description: "Your package is prepared.", done: true },
      { status: "Shipped", date: "30 Apr 2025, 02:00 PM", description: "Carrier has picked up package. Tracking ID: TRK874392810", done: true },
      { status: "Delivered", date: "Pending", description: "Package is currently in transit.", done: false }
    ]
  },
  {
    id: "EZC-2504-0021",
    date: "18 Apr 2025",
    status: "Processing",
    itemCount: 1,
    total: 2150,
    items: [
      {
        name: "Real Madrid Away Jersey 2024/25",
        size: "XL",
        color: "Orange",
        qty: 1,
        price: 2150,
        image: "/mock-jersey-rm.png"
      }
    ],
    timeline: [
      { status: "Order Placed", date: "18 Apr 2025, 04:12 PM", description: "Your order has been successfully placed.", done: true },
      { status: "Payment Confirmed", date: "18 Apr 2025, 04:15 PM", description: "Payment was successfully processed.", done: true },
      { status: "Order Processed", date: "Pending", description: "Your package is being prepared.", done: false },
      { status: "Shipped", date: "Pending", description: "Carrier is waiting for pickup.", done: false },
      { status: "Delivered", date: "Pending", description: "Package delivery pending.", done: false }
    ]
  },
  {
    id: "EZC-2504-0010",
    date: "10 Apr 2025",
    status: "Cancelled",
    itemCount: 1,
    total: 950,
    items: [
      {
        name: "Arsenal Classic Polo Shirt",
        size: "M",
        color: "White",
        qty: 1,
        price: 950,
        image: "/mock-polo-arsenal.png"
      }
    ],
    timeline: [
      { status: "Order Placed", date: "10 Apr 2025, 01:20 PM", description: "Your order has been successfully placed.", done: true },
      { status: "Cancelled", date: "10 Apr 2025, 02:45 PM", description: "Order was cancelled by the user.", done: true }
    ]
  },
  {
    id: "EZC-2503-0045",
    date: "30 Mar 2025",
    status: "Refunded",
    itemCount: 1,
    total: 1780,
    items: [
      {
        name: "Italy Vintage Track Jacket",
        size: "L",
        color: "Blue",
        qty: 1,
        price: 1780,
        image: "/mock-jacket-italy.png"
      }
    ],
    timeline: [
      { status: "Order Placed", date: "30 Mar 2025, 09:15 AM", description: "Your order has been successfully placed.", done: true },
      { status: "Payment Confirmed", date: "30 Mar 2025, 09:20 AM", description: "Payment was successfully processed.", done: true },
      { status: "Refunded", date: "02 Apr 2025, 11:30 AM", description: "Funds have been returned to original payment source.", done: true }
    ]
  }
];

export const mockAddresses: MockAddress[] = [
  {
    id: "addr-1",
    fullName: "Rifat Ahmed",
    address1: "House 12, Road 5, Dhanmondi",
    city: "Dhaka",
    state: "Dhaka",
    postalCode: "1205",
    country: "Bangladesh",
    phone: "+880 1712 345 678",
    isDefaultShipping: true,
    type: "shipping"
  },
  {
    id: "addr-2",
    fullName: "Rifat Ahmed",
    address1: "House 12, Road 5, Dhanmondi",
    city: "Dhaka",
    state: "Dhaka",
    postalCode: "1205",
    country: "Bangladesh",
    phone: "+880 1712 345 678",
    isDefaultBilling: true,
    type: "billing"
  },
  {
    id: "addr-3",
    fullName: "Rifat Ahmed",
    address1: "House 12, Road 5, Dhanmondi",
    city: "Dhaka",
    state: "Dhaka",
    postalCode: "1205",
    country: "Bangladesh",
    phone: "+880 1712 345 678",
    type: "home"
  }
];
