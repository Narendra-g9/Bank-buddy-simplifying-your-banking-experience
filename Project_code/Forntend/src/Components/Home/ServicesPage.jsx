import React from "react";

// Icon Components
const CreditIcon = () => (
  <svg width={15} height={15} viewBox="0 0 15 15" className="w-5 h-5">
    <path
      d="M9.96424 2.68571C10.0668 2.42931 9.94209 2.13833 9.6857 2.03577C9.4293 1.93322 9.13832 2.05792 9.03576 2.31432L5.03576 12.3143C4.9332 12.5707 5.05791 12.8617 5.3143 12.9642C5.5707 13.0668 5.86168 12.9421 5.96424 12.6857L9.96424 2.68571Z"
      fill="currentColor"
    />
  </svg>
);

const DebitIcon = () => (
  <svg width={15} height={15} viewBox="0 0 15 15" className="w-5 h-5">
    <path
      d="M0.849976 1.74998C0.849976 1.25292 1.25292 0.849976 1.74998 0.849976H3.24998C3.74703 0.849976 4.14998 1.25292 4.14998 1.74998V2.04998H10.85V1.74998C10.85 1.25292 11.2529 0.849976 11.75 0.849976H13.25C13.747 0.849976 14.15 1.25292 14.15 1.74998V3.24998C14.15 3.74703 13.747 4.14998 13.25 4.14998H12.95V10.85H13.25C13.747 10.85 14.15 11.2529 14.15 11.75V13.25C14.15 13.747 13.747 14.15 13.25 14.15H11.75C11.2529 14.15 10.85 13.747 10.85 13.25V12.95H4.14998V13.25C4.14998 13.747 3.74703 14.15 3.24998 14.15H1.74998C1.25292 14.15 0.849976 13.747 0.849976 13.25V11.75C0.849976 11.2529 1.25292 10.85 1.74998 10.85H2.04998V4.14998H1.74998C1.25292 4.14998 0.849976 3.74703 0.849976 3.24998V1.74998Z"
      fill="currentColor"
    />
  </svg>
);

const TransferIcon = () => (
  <svg width={15} height={15} viewBox="0 0 15 15" className="w-5 h-5">
    <path
      d="M7.28856 0.796908C7.42258 0.734364 7.57742 0.734364 7.71144 0.796908L13.7114 3.59691C13.8875 3.67906 14 3.85574 14 4.05V10.95C14 11.1443 13.8875 11.3209 13.7114 11.4031L7.71144 14.2031C7.57742 14.2656 7.42258 14.2656 7.28856 14.2031L1.28856 11.4031C1.11252 11.3209 1 11.1443 1 10.95V4.05C1 3.85574 1.11252 3.67906 1.28856 3.59691L7.28856 0.796908Z"
      fill="currentColor"
    />
  </svg>
);

// Service Card Component
function ServiceCard({ icon, title, description }) {
  return (
    <div className="flex gap-4 items-start flex-col">
      <span className="text-violet-600 bg-violet-500/10 p-3 rounded-full">{icon}</span>
      <div>
        <h3 className="font-semibold text-xl">{title}</h3>
        <p className="mt-1 text-gray-500">{description}</p>
      </div>
    </div>
  );
}

// Main Services Page
function ServicesPage() {
  return (
    <div className="object-cover lg:min-h-[85vh] bg-no-repeat p-10">
      <div className="grid md:grid-cols-3 max-w-screen-lg mx-auto gap-10 bg-white p-5 shadow-xl">
        <ServiceCard
          icon={<CreditIcon />}
          title="Credit"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore maxime libero id ut sapiente."
        />
        <ServiceCard
          icon={<DebitIcon />}
          title="Debit"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum fugit cumque aliquid corporis."
        />
        <ServiceCard
          icon={<TransferIcon />}
          title="Transfer"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores perferendis minus, expedita."
        />
      </div>
    </div>
  );
}

export default ServicesPage;
