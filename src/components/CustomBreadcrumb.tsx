import { Breadcrumb } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'

const routeTitleMap: Record<string, string> = {
    users: 'Users',
    profile: 'Profile',
    settings: 'Settings',
    // stb.
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const CustomBreadcrumb = () => {
    const { pathname } = useLocation();
    const [breadcrumbItems, setBreadcrumbItems] = useState<{ title: string, path: string }[]>([]);
    useEffect(() => {
        const parts = pathname.split('/').filter(Boolean);
        const items = parts.map((part, index) => {
            const path = '/' + parts.slice(0, index + 1).join('/');
            return {
                title: routeTitleMap[part] || capitalize(part),
                path,
            };
        });
        setBreadcrumbItems([{ title: 'Home', path: '/' }, ...items]);
    }, [pathname]);
    return (
        <div>
            <Breadcrumb className="flex">
                {breadcrumbItems.map((item, index) => (
                    <Breadcrumb.Item key={item.path}>
                        {index === breadcrumbItems.length - 1 ? (
                            item.title
                        ) : (
                            <Link to={item.path}>{item.title}</Link>
                        )}
                    </Breadcrumb.Item>
                ))}
            </Breadcrumb>
        </div>
    )
}

export default CustomBreadcrumb