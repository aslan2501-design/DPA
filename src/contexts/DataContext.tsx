import React, { createContext, useContext, useState, useEffect } from 'react';
import { Package, Truck, Wrench } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { AdvancedStorageService } from '@/lib/AdvancedStorageService';

export interface Request {
    id: string;
    userId?: string;
    type: 'warehouse' | 'trolley';
    title: string;
    status: 'pending' | 'approved' | 'rejected' | 'in_progress';
    date: string;
    details: string;
    vesselName?: string;
    shippingAgent?: string;
    cargoType?: string;
    quantity?: string;
    fromDate?: string;
    toDate?: string;
    owner?: string;
}

export interface Complaint {
    id: string;
    userId?: string;
    createdBy?: string;
    title: string;
    faultType: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in_progress' | 'resolved';
    location: string;
    facilityId?: string;
    mapPath?: string;
    date: string;
    description: string;
}

interface DataContextType {
    requests: Request[];
    complaints: Complaint[];
    addRequest: (request: Omit<Request, 'id' | 'date'>, status?: Request['status']) => void;
    addComplaint: (complaint: Omit<Complaint, 'id' | 'date' | 'userId'>, userId?: string, status?: Complaint['status']) => void;
    updateRequestStatus: (id: string, status: Request['status']) => void;
    updateComplaintStatus: (id: string, status: Complaint['status']) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { language } = useLanguage();

    const [requests, setRequests] = useState<Request[]>([]);
    const [complaints, setComplaints] = useState<Complaint[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                await AdvancedStorageService.initialize();
                
                const savedRequests = await AdvancedStorageService.getRequests();
                const savedComplaints = await AdvancedStorageService.getComplaints();

                // Load or create default requests - ensure we have 20 warehouse + 10 trolley requests
                let allRequests = [...savedRequests];
                
                if (allRequests.length < 30) {
                    const today = '2026-02-10';
                    
                    // Warehouse companies
                    const companies = [
                        { ar: 'شركة النيل للشحن', en: 'Nile Shipping Co.' , cargo: {ar: 'حاويات', en: 'Containers'}, qty: '120'},
                        { ar: 'رويال للشحن', en: 'Royal Shipping' , cargo: {ar: 'بضائع عامة', en: 'General cargo'}, qty: '300'},
                        { ar: 'الشركة المصرية للشحن', en: 'Egyptian Freight Ltd.' , cargo: {ar: 'نفط خام', en: 'Crude oil'}, qty: '800'},
                        { ar: 'المتحدة للتخليص', en: 'United Clearing' , cargo: {ar: 'حبوب (قمح)', en: 'Grains (Wheat)'}, qty: '500'},
                        { ar: 'كايرو ترانس', en: 'Cairo Trans' , cargo: {ar: 'سيارات', en: 'Vehicles'}, qty: '60'},
                        { ar: 'مارين لوجيستيك', en: 'Marine Logistics' , cargo: {ar: 'مواد كيماوية', en: 'Chemicals'}, qty: '200'},
                        { ar: 'سيسكو للشحن', en: 'Cisco Freight' , cargo: {ar: 'معدات ثقيلة', en: 'Heavy equipment'}, qty: '40'},
                        { ar: 'ميد سوفت للشحن', en: 'MedSoft Shipping' , cargo: {ar: 'مستحضرات طبية', en: 'Medical supplies'}, qty: '30'},
                        { ar: 'الشروق للنقل', en: 'Al-Shorouk Transport' , cargo: {ar: 'أسمدة', en: 'Fertilizers'}, qty: '220'},
                        { ar: 'سنابل للشحن', en: 'Sanabel Shipping' , cargo: {ar: 'سكر', en: 'Sugar'}, qty: '420'},
                        { ar: 'الفارس العربي', en: 'Al-Faris' , cargo: {ar: 'غاز مسال', en: 'LPG'}, qty: '150'},
                        { ar: 'أجواء للنقل', en: 'Ajwa Transport' , cargo: {ar: 'منسوجات', en: 'Textiles'}, qty: '90'},
                        { ar: 'رويال للبتروكيماويات', en: 'Royal Petrochem' , cargo: {ar: 'منتجات نفطية', en: 'Refined petroleum'}, qty: '600'},
                        { ar: 'إفكو', en: 'EFCO' , cargo: {ar: 'زيوت نباتية', en: 'Vegetable oils'}, qty: '260'},
                        { ar: 'أرما للشحن', en: 'Arma Shipping' , cargo: {ar: 'معادن خام', en: 'Raw metals'}, qty: '700'},
                        { ar: 'المنصورة للراتنجات', en: 'Mansoura Resins' , cargo: {ar: 'راتنجات', en: 'Resins'}, qty: '180'},
                        { ar: 'شركة الوطنية للشحن', en: 'National Freight' , cargo: {ar: 'بضائع عامة', en: 'General cargo'}, qty: '140'},
                        { ar: 'كايرو ثري لوجيستيك', en: 'Cairo3 Logistics' , cargo: {ar: 'حاويات 40 قدم', en: '40ft containers'}, qty: '75'},
                        { ar: 'شركة البدري للشحن', en: 'Al-Badri Shipping' , cargo: {ar: 'معدات إلكترونية', en: 'Electronics'}, qty: '55'},
                        { ar: 'الدلتا للسكر', en: 'Delta Sugar' , cargo: {ar: 'سكر خام', en: 'Raw sugar'}, qty: '480'},
                    ];

                    const vessels = [
                        { ar: 'العائدة', en: 'Al-Aeda', agent: 'مصر للملاحة', cargoType: 'حاويات' },
                        { ar: 'النيل', en: 'Nile', agent: 'الشركة الأفريقية', cargoType: 'بضائع عامة' },
                        { ar: 'سيناء', en: 'Sinai', agent: 'الرويال', cargoType: 'معدات' },
                        { ar: 'المرشدي', en: 'El-Morshedy', agent: 'الشروق', cargoType: 'حبوب' },
                        { ar: 'فاروق', en: 'Farouk', agent: 'ميد سوفت', cargoType: 'زيوت' },
                        { ar: 'النل الأزرق', en: 'Blue Nile', agent: 'كايرو لوجيستيك', cargoType: 'سكر' },
                        { ar: 'المصرية', en: 'Al-Masriya', agent: 'الفارس', cargoType: 'أسمدة' },
                        { ar: 'وادي النيل', en: 'Wadi Nile', agent: 'سيسكو', cargoType: 'معادن' },
                        { ar: 'مصر الحديثة', en: 'Modern Egypt', agent: 'أرما', cargoType: 'منتجات نفطية' },
                        { ar: 'الهلال', en: 'Al-Hilal', agent: 'رويال بتروكيماويات', cargoType: 'كيماويات' },
                    ];

                    // Add warehouse requests if missing
                    const warehouseCount = allRequests.filter(r => r.type === 'warehouse').length;
                    if (warehouseCount < 20) {
                        const newWarehouseRequests: Request[] = companies.map((c, idx) => ({
                            id: `w${Date.now()}_${idx}`,
                            userId: 'system',
                            type: 'warehouse',
                            title: language === 'ar' ? `طلب حجز مخزن - ${c.ar}` : `Warehouse Booking - ${c.en}`,
                            status: 'pending',
                            date: today,
                            details: language === 'ar' ? `${c.cargo.ar} - ${c.qty} طن` : `${c.cargo.en} - ${c.qty} tons`,
                            owner: language === 'ar' ? c.ar : c.en,
                            cargoType: language === 'ar' ? c.cargo.ar : c.cargo.en,
                            quantity: c.qty,
                        }));
                        
                        for (const req of newWarehouseRequests) {
                            await AdvancedStorageService.addRequest(req);
                            allRequests.push(req);
                        }
                    }

                    // Add trolley requests if missing
                    const trolleyCount = allRequests.filter(r => r.type === 'trolley').length;
                    if (trolleyCount < 10) {
                        const newTrolleyRequests: Request[] = vessels.map((v, idx) => ({
                            id: `t${Date.now()}_${idx}`,
                            userId: 'system',
                            type: 'trolley',
                            title: language === 'ar' ? `طلب تراكى - ${v.ar}` : `Berthing - ${v.en}`,
                            status: 'pending',
                            date: today,
                            details: language === 'ar' ? `${v.cargoType} - توكيل: ${v.agent}` : `${v.cargoType} - Agent: ${v.agent}`,
                            vesselName: language === 'ar' ? v.ar : v.en,
                            shippingAgent: v.agent,
                            cargoType: v.cargoType,
                        }));

                        for (const req of newTrolleyRequests) {
                            await AdvancedStorageService.addRequest(req);
                            allRequests.push(req);
                        }
                    }
                }
                
                setRequests(allRequests);

                // Load or create default complaints - ensure we have 10 complaints
                let allComplaints = [...savedComplaints];
                
                if (allComplaints.length < 10) {
                    const today = '2026-02-10';
                    const maintenanceIssues = [
                        { ar: 'عطل في نظام الإضاءة', en: 'Lighting System Failure', desc: { ar: 'انقطاع الإضاءة في منطقة التحميل', en: 'Power outage in loading area' }, type: 'كهربائي', loc: 'رصيف 3' },
                        { ar: 'عطل في نظام التهوية', en: 'Ventilation System Malfunction', desc: { ar: 'توقف المراوح في المستودع الرئيسي', en: 'Fans stopped in main warehouse' }, type: 'ميكانيكي', loc: 'المستودع الرئيسي' },
                        { ar: 'تسرب في خط المياه', en: 'Water Leak', desc: { ar: 'تسرب في أنابيب المياه بالرصيف', en: 'Pipe leak at berth area' }, type: 'سباكة', loc: 'رصيف 1' },
                        { ar: 'عطل في بوابة الدخول', en: 'Gate Malfunction', desc: { ar: 'بوابة المدخل الرئيسي لا تفتح تلقائياً', en: 'Main entrance gate not opening' }, type: 'كهربائي', loc: 'المدخل الرئيسي' },
                        { ar: 'تلف في الرصيف', en: 'Dock Damage', desc: { ar: 'شقوق وتلف في سطح الرصيف', en: 'Cracks on dock surface' }, type: 'إنشائي', loc: 'رصيف 2' },
                        { ar: 'عطل في نظام المراقبة', en: 'CCTV System Failure', desc: { ar: 'كاميرات المراقبة لا تعمل في القطاع C', en: 'Cameras offline in sector C' }, type: 'إلكتروني', loc: 'القطاع C' },
                        { ar: 'تسرب الزيت من الآلات', en: 'Machinery Oil Leak', desc: { ar: 'تسرب زيت من رافعة الحاويات', en: 'Oil leaking from container crane' }, type: 'ميكانيكي', loc: 'منطقة الحاويات' },
                        { ar: 'عطل في نظام الصرف', en: 'Drainage System Blocked', desc: { ar: 'انسداد في نظام الصرف الصحي', en: 'Sewage system blocked' }, type: 'سباكة', loc: 'منطقة الخدمات' },
                        { ar: 'شقوق في جدران المستودع', en: 'Wall Cracks in Warehouse', desc: { ar: 'ظهور شقوق بسبب الرطوبة', en: 'Wall cracks due to moisture' }, type: 'إنشائي', loc: 'مستودع الكيماويات' },
                        { ar: 'عطل في المراوح الكبيرة', en: 'Large Fan Failure', desc: { ar: 'توقف المراوح الغاطسة في الخزان', en: 'Submerged fans stopped' }, type: 'كهربائي', loc: 'خزان التبريد' },
                    ];

                    const newComplaints: Complaint[] = maintenanceIssues.map((issue, idx) => ({
                        id: `c${Date.now()}_${idx}`,
                        title: language === 'ar' ? issue.ar : issue.en,
                        faultType: language === 'ar' ? issue.type : issue.type,
                        priority: idx % 3 === 0 ? 'high' : idx % 3 === 1 ? 'medium' : 'low',
                        status: idx % 2 === 0 ? 'pending' : idx % 3 === 0 ? 'in_progress' : 'resolved',
                        location: language === 'ar' ? issue.loc : issue.loc,
                        date: today,
                        description: language === 'ar' ? issue.desc.ar : issue.desc.en,
                    }));

                    for (const comp of newComplaints) {
                        await AdvancedStorageService.addComplaint(comp);
                        allComplaints.push(comp);
                    }
                }
                
                setComplaints(allComplaints);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        loadData();
    }, [language]);

    const addRequest = (newReq: Omit<Request, 'id' | 'date'>, status?: Request['status']) => {
        const request: Request = {
            ...newReq,
            id: Math.random().toString(36).substr(2, 9),
            status: status || 'pending',
            date: new Date().toISOString().split('T')[0],
        };

        AdvancedStorageService.addRequest(request).catch((error) => {
            console.error('Error saving request:', error);
        });

        setRequests((prev) => [request, ...prev]);
    };

    const addComplaint = (newComp: Omit<Complaint, 'id' | 'date' | 'userId'>, userId?: string, status?: Complaint['status']) => {
        const complaint: Complaint = {
            ...newComp,
            id: Math.random().toString(36).substr(2, 9),
            status: status || 'pending',
            date: new Date().toISOString().split('T')[0],
            userId: userId,
        };

        AdvancedStorageService.addComplaint(complaint).catch((error) => {
            console.error('Error saving complaint:', error);
        });

        setComplaints((prev) => [complaint, ...prev]);

        (async () => {
            try {
                await fetch('/api/complaints', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(complaint),
                });
            } catch (error) {
                console.warn('Failed to POST complaint to /api/complaints', error);
            }
        })();
    };

    const updateRequestStatus = (id: string, status: Request['status']) => {
        const updatedRequest = requests.find(req => req.id === id);
        if (updatedRequest) {
            const updated = { ...updatedRequest, status };
            AdvancedStorageService.updateRequest(updated).catch((error) => {
                console.error('Error updating request:', error);
            });
        }
        setRequests(prev => prev.map(req =>
            req.id === id ? { ...req, status } : req
        ));
    };

    const updateComplaintStatus = (id: string, status: Complaint['status']) => {
        const updatedComplaint = complaints.find(comp => comp.id === id);
        if (updatedComplaint) {
            const updated = { ...updatedComplaint, status };
            AdvancedStorageService.updateComplaint(updated).catch((error) => {
                console.error('Error updating complaint:', error);
            });
        }
        setComplaints(prev => prev.map(comp =>
            comp.id === id ? { ...comp, status } : comp
        ));
    };

    return (
        <DataContext.Provider value={{ requests, complaints, addRequest, addComplaint, updateRequestStatus, updateComplaintStatus }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};




