
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

export function BreadcrumbNav({ items }: BreadcrumbsProps) {
  return (
    <div className="px-4 py-2 mb-4 bg-gray-50">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {items.map((item, index) => {
            const isLastItem = index === items.length - 1;
            
            return (
              <BreadcrumbItem key={index}>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                
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
