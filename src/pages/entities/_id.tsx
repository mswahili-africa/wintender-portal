// // import { getVendorById } from "@/services/vendors";
// import { IconBuildingSkyscraper, IconCalendarEvent, IconIdBadge2, IconLocation, IconMail, IconMapPin, IconPhone, IconTrafficCone, IconUser, IconUsersGroup } from "@tabler/icons-react";
// import { useQuery } from "@tanstack/react-query";
// import { Fragment } from "react";
// import { useParams } from "react-router-dom";



// export default function() {
//     const { id } = useParams();

//     const { data, isLoading } = useQuery({
//         queryKey: ["getVendorById", id],
//         queryFn: () => getVendorById(id ?? ""),
//         refetchInterval: 20000,
//         keepPreviousData: true
//     })

//     return (
//         <div>
//             {
//                 isLoading ?
//                 <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-8 border border-slate-200 rounded-md p-4 md:px-8 md:py-6">
//                     {
//                         [...Array(12)].map(() => {
//                             return (
//                                 <div className="animate-pulse">
//                                     <div className="w-24 h-2 bg-slate-100 rounded-md mb-2"></div>
//                                     <div className="w-32 h-2 bg-slate-100 rounded-md"></div>
//                                 </div>
//                             )
//                         })
//                     }
//                 </div> :

//                 <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 text-xs md:text-sm border border-slate-200 rounded-md p-4 md:px-8 md:py-6">
//                     {
//                         data &&

//                         <Fragment>
//                             <div className="flex items-start space-x-3">
//                                 <IconUser className="h-5 w-5 text-slate-400" />
                                
//                                 <div className="grow">
//                                     <h4 className="text-slate-400 mb-1">Name</h4>
//                                     <p className="capitalize">{data.name}</p>
//                                 </div>
//                             </div>

//                             <div className="flex items-start space-x-3">
//                                 <IconTrafficCone className="h-5 w-5 text-slate-400" />
                                
//                                 <div className="grow">
//                                     <h4 className="text-slate-400 mb-1">Status</h4>
//                                     <p className="capitalize">{data.status}</p>
//                                 </div>
//                             </div>

//                             <div className="flex items-start space-x-3">
//                                 <IconMail className="h-5 w-5 text-slate-400" />
                                
//                                 <div className="grow">
//                                     <h4 className="text-slate-400 mb-1">Email</h4>
//                                     <p className="capitalize">{data.email}</p>
//                                 </div>
//                             </div>

//                             <div className="flex items-start space-x-3">
//                                 <IconPhone className="h-5 w-5 text-slate-400" />
                                
//                                 <div className="grow">
//                                     <h4 className="text-slate-400 mb-1">Primary Phone</h4>
//                                     <p className="capitalize">{data.primaryNumber}</p>
//                                 </div>
//                             </div>

//                             <div className="flex items-start space-x-3">
//                                 <IconPhone className="h-5 w-5 text-slate-400" />
                                
//                                 <div className="grow">
//                                     <h4 className="text-slate-400 mb-1">Secondary Phone</h4>
//                                     <p className="capitalize">{data.secondaryNumber}</p>
//                                 </div>
//                             </div>

//                             <div className="flex items-start space-x-3">
//                                 <IconLocation className="h-5 w-5 text-slate-400" />
                                
//                                 <div className="grow">
//                                     <h4 className="text-slate-400 mb-1">Address</h4>
//                                     <p className="capitalize">{data.address}</p>
//                                 </div>
//                             </div>

//                             <div className="flex items-start space-x-3">
//                                 <IconMapPin className="h-5 w-5 text-slate-400" />
                                
//                                 <div className="grow">
//                                     <h4 className="text-slate-400 mb-1">Latitude</h4>
//                                     <p className="capitalize">{data.latitude}</p>
//                                 </div>
//                             </div>

//                             <div className="flex items-start space-x-3">
//                                 <IconMapPin className="h-5 w-5 text-slate-400" />
                                
//                                 <div className="grow">
//                                     <h4 className="text-slate-400 mb-1">Longitude</h4>
//                                     <p className="capitalize">{data.longitude}</p>
//                                 </div>
//                             </div>

//                             <div className="flex items-start space-x-3">
//                                 <IconIdBadge2 className="h-5 w-5 text-slate-400" />
                                
//                                 <div className="grow">
//                                     <h4 className="text-slate-400 mb-1">TIN</h4>
//                                     <p className="capitalize">{data.tin}</p>
//                                 </div>
//                             </div>

//                             <div className="flex items-start space-x-3">
//                                 <IconBuildingSkyscraper className="h-5 w-5 text-slate-400" />
                                
//                                 <div className="grow">
//                                     <h4 className="text-slate-400 mb-1">Business Licence</h4>
//                                     <p className="capitalize">{data.businessLicence}</p>
//                                 </div>
//                             </div>
                            
//                             <div className="flex items-start space-x-3">
//                                 <IconCalendarEvent className="h-5 w-5 text-slate-400" />
                                
//                                 <div className="grow">
//                                     <h4 className="text-slate-400 mb-1">Licence Expire Date</h4>
//                                     <p className="capitalize">{new Date(data.licenceExpireDate).toLocaleDateString()}</p>
//                                 </div>
//                             </div>
// {/* 
//                             <div className="flex items-start space-x-3">
//                                 <IconUser className="h-5 w-5 text-slate-400" />
                                
//                                 <div className="grow">
//                                     <h4 className="text-slate-400 mb-1">Created By</h4>
//                                     <p className="capitalize">{data.createdBy}</p>
//                                 </div>
//                             </div> */}

//                             <div className="flex items-start space-x-3">
//                                 <IconCalendarEvent className="h-5 w-5 text-slate-400" />
                                
//                                 <div className="grow">
//                                     <h4 className="text-slate-400 mb-1">Creation Date</h4>
//                                     <p className="capitalize">{new Date(data.createdAt).toLocaleDateString()}</p>
//                                 </div>
//                             </div>
//                         </Fragment>
//                     }
//                 </div>
//             }
//         </div>
//     )
// }