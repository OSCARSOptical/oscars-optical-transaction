import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

import { useLocation, useParams } from "react-router-dom";

function getTransactionBreadcrumbs(items: BreadcrumbItem[], location: any, params: any) {
  if (
    location.pathname.startsWith("/patients/") &&
    location.pathname.includes("/transactions/")
  ) {
    const patientName = location.state?.patientName;
    const patientCode = params.patientCode;
    const transactionCode = params.transactionCode;

    return [
      { label: "Home", href: "/" },
      { label: "Patients", href: "/patients" },
      patientName
        ? { label: patientName, href: `/patients/${patientCode}` }
        : { label: patientCode, href: `/patients/${patientCode}` },
      { label: transactionCode }
    ];
  }

  return items;
}

export function BreadcrumbNav({ items }: BreadcrumbsProps) {
  const location = useLocation?.() ?? { pathname: "" };
  const params = useParams?.() ?? {};

  const computedItems =
    getTransactionBreadcrumbs(items, location, params);

  return (
    <div className="px-4 py-2 mb-4 bg-gray-50">
      <Breadcrumb>
        <BreadcrumbList>
          {computedItems.map((item, index) => {
            const isLastItem = index === computedItems.length - 1;

            return (
              <BreadcrumbItem key={index}>
                {index !== 0 && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                )}
                {isLastItem ? (
                  <BreadcrumbPage className="text-[#241715] text-sm font-medium">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      to={item.href || '#'}
                      className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                    >
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

export default BreadcrumbNav;
