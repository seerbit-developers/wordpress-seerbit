// /** @format */
//
// import React, { memo, useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import {
//   updateUser,
//   updateBusiness,
//   getKYC,
//   getIndustries,
//   getCountries,
//   getBankList,
//   resetKeys,
//   getBusinessUsers,
//   inviteUser,
//   getRoles,
//   updateRole,
//   addRole,
//   recoverPassword,
//   nameInquiry,
//   updateUserRole,
//   getBranches,
//   fixUserToBranch,
//   switchUserMode,
//   getBusiness,
//   updateSettlement,
//   clearState
// } from "../../actions/postActions";
// import { Can } from "../../modules/Can";
//
// import cogoToast from "cogo-toast";
//
// import { Template as PersonalDetails } from "../setup/personal_details";
// import { Template as BusinessDetails } from "../setup/business_details";
// import { Template as BankDetails } from "../setup/bank_details";
// import { APIKeys } from "../setup/api_keys";
// import PaymentConfig from "../setup/configurations";
// import Webhook from "../setup/webhook";
// import Customization from "../setup/customization";
// import UserManagement from "../account/users_management";
// import Ads from "../ads_customization";
// import PreAuth from "../setup/pre-auth";
// import { isEmpty } from "lodash";
// import User from "../../assets/images/svg/user.svg";
// import BussinessIcon from "../../assets/images/svg/business-information-icon.svg";
// import BankIcon from "../../assets/images/svg/bank-information-icon.svg";
// import APIKeyIcon from "../../assets/images/svg/api-key-icon.svg";
// import ConfigurationIcon from "../../assets/images/svg/configuration-icon.svg";
// import CustomizationIcon from "../../assets/images/svg/payment-link-icon.svg";
// import WebhookIcon from "../../assets/images/svg/webhook-icon.svg";
// import UsersIcon from "../../assets/images/svg/user-management-icon.svg";
// import settingsOptions from "../../utils/strings/settings.json";
// import Brand from "../../utils/strings/brand.json";
//
// import "./css/settings.scss";
// import styled, { keyframes } from "styled-components";
//
// const Wrapper = styled.div`
//   background: #fff;
// `;
//
// const NavMenuItem = styled.div`
//   width: 95vw;
//   margin: auto;
//   font-size: 1.1em;
//   color: #676767 !important;
//   min-height: calc(100vh - 80px);
// `;
//
// const animateHeader = () => keyframes`
//     0% {
//       opacity: 0;
//       margin-left: -25;
//       margin-right: 25;
//     }
//     100% {
//       opacity: 1;
//       margin-left: 0;
//       margin-right: 0;
//     }
// `;
//
// const Header = styled.div`
//   animation: ${() => animateHeader()} 0.6s linear;
// `;
//
// const animateBody = () => keyframes`
//     0% {
//       opacity: 0;
//       margin-top: -25;
//       margin-bottom: 25;
//     }
//     100% {
//       opacity: 1;
//       margin-top: 0;
//       margin-bottom: 0;
//     }
// `;
//
// const Body = styled.div`
//   animation: ${() => animateBody()} 0.6s linear;
// `;
//
// export function Settings(props) {
//   const [active, setActive] = useState((props.match.params.id || 0) - 0);
//   const [addressProcess, setAddressProcess] = useState(false);
//   const [informationProcess, setInformationProcess] = useState(false);
//   const [contactProcess, setContactProcess] = useState(false);
//   const [kycProcess, setKycProcess] = useState(false);
//   const [logoProcess, setLogoProcess] = useState(false);
//
//   const [progress, setProgress] = useState(0);
//   const [bankProcess, setBankProcess] = useState(false);
//   const [apiKeyProcess, setApiKeyProcess] = useState(false);
//   const [personalProcess, setPersonalProcess] = useState(false);
//   const [configProcess, setConfigProcess] = useState(false);
//   const [preAuthProcess, setPreAuthProcess] = useState(false);
//   const [customProcess, setCustomProcess] = useState(false);
//   const [webhookProcess, setWebhookProcess] = useState(false);
//   const [roleProcess, setRoleProcess] = useState(false);
//   const [userProcess, setUserProcess] = useState(false);
//   const [inviteProcess, setInviteProcess] = useState(false);
//   const [loading, setLoading] = useState(false);
//
//   useEffect(() => {
//     if (props.user_details && props.location === "personal_information") {
//       cogoToast.success("Update successful", { position: "top-right" });
//       setPersonalProcess(false);
//     }
//
//     if (props.business_details && props.location === "business_information") {
//       cogoToast.success("Update successful", { position: "top-right" });
//       props.getBusiness();
//       setAddressProcess(false);
//       setInformationProcess(false);
//       setContactProcess(false);
//       setKycProcess(false);
//       setBankProcess(false);
//       setApiKeyProcess(false);
//       setConfigProcess(false);
//       setPreAuthProcess(false);
//       setLogoProcess(false);
//       setCustomProcess(false);
//       setWebhookProcess(false);
//       setProgress(0);
//     }
//     if (props.invite_user && props.location === "invite_user") {
//       cogoToast.success("Invite sent successful", { position: "top-right" });
//       props.clearState({ invite_user: null });
//       setInviteProcess(false);
//     }
//
//     if (props.location === "update_user_role") {
//       cogoToast.success("action completed successful", {
//         position: "top-right",
//       });
//       props.getBusinessUsers();
//       setUserProcess(false);
//     }
//
//     if (props.location === "emailnotification" && props.recover_password) {
//       cogoToast.success(
//         `An email with reset link has been sent to ${props.user_details.email}`,
//         {
//           position: "top-right",
//         }
//       );
//       props.clearState({ recover_password: null });
//       setPersonalProcess(false);
//     }
//
//     if (props.role && props.location === "update_role") {
//       cogoToast.success("action completed successful", {
//         position: "top-right",
//       });
//       props.clearState({ role: null });
//       setRoleProcess(false);
//       props.getRoles();
//     }
//   }, [
//     props.location,
//     props.user_details,
//     props.business_details,
//     props.countries,
//     props.bank_list,
//     props.business_users,
//     props.recover_password,
//     props.name_inquiry,
//   ]);
//
//   useEffect(() => {
//     if (
//       props.error_details &&
//       props.error_details.error_source === "personal_information"
//     ) {
//       cogoToast.error(props.error_details.message, { position: "top-right" });
//       setPersonalProcess(false);
//     }
//     if (
//       props.error_details &&
//       props.error_details.error_source === "emailnotification"
//     ) {
//       cogoToast.error(props.error_details.message, { position: "top-right" });
//       setPersonalProcess(false);
//     }
//     if (
//       props.error_details &&
//       props.error_details.error_source === "invite_user"
//     ) {
//       cogoToast.error(props.error_details.message || "action not completed", {
//         position: "top-right",
//       });
//       setInviteProcess(false);
//       props.getBusinessUsers();
//     }
//     if (
//       props.error_details &&
//       props.error_details.error_source === "update_role"
//     ) {
//       cogoToast.error(props.error_details.message || "action not completed", {
//         position: "top-right",
//       });
//       setRoleProcess(false);
//     }
//
//     if (
//       props.error_details &&
//       props.error_details.error_source === "business_information"
//     ) {
//       cogoToast.error(props.error_details.message || "action not completed", {
//         position: "top-right",
//       });
//       setAddressProcess(false);
//       setInformationProcess(false);
//       setContactProcess(false);
//       setKycProcess(false);
//       setBankProcess(false);
//       setApiKeyProcess(false);
//       setConfigProcess(false);
//       setPreAuthProcess(false);
//       setLogoProcess(false);
//       setWebhookProcess(false);
//       setProgress(0);
//     }
//     if (
//       props.error_details &&
//       props.error_details.error_source === "update_user_role"
//     ) {
//       cogoToast.error(props.error_details.message || "action not completed", {
//         position: "top-right",
//       });
//       props.getBusinessUsers();
//       setUserProcess(false);
//     }
//     props.clearState({ error_details: null });
//   }, [props.error_details]);
//
//   useEffect(() => {
//     props.clearState({ update_single_advert_status: null });
//     props.clearState({ update_ads_status: null });
//     props.getIndustries();
//     props.getCountries();
//     props.getBankList();
//     // props.getBusinessUsers();
//     props.getBusiness();
//     props.getRoles();
//     props.getBranches();
//   }, []);
//
//   useEffect(() => {
//     setLoading(true);
//     if (!isEmpty(props.business_users && props.business_users.payload))
//       setLoading(false);
//     if (!isEmpty(props.error_details)) setLoading(false);
//   }, [props.business_users, props.error_details]);
//
//   return (
//     <Wrapper className="brand-settings">
//       <NavMenuItem className="py-5">
//         <div className="font-medium font-20 text-black">Settings</div>{" "}
//         <div className="row pt-5 mx-0">
//           <Header className="float-left" style={{ width: "300px" }}>
//             {settingsOptions.map(
//               (item, key) => (
//                 <Can access={item.access}>
//                   <div
//                     className={`row mb-2 mx-0 py-2 cursor-pointer ${item.index === active ? "active" : ""
//                       }`}
//                     style={{
//                       background: "#F5F7FA",
//                       border: "1px solid #F5F7FA;",
//                     }}
//                     key={key}
//                     onClick={() => setActive(item.index)}
//                   >
//                     <div className="col">
//                       <div className="row">
//                         <div className="px-3">
//                           <div className="title">
//                             {" "}
//                             <img
//                               style={{ width: "25px", height: "25px" }}
//                               src={
//                                 item.index === 0
//                                   ? User
//                                   : item.index === 1
//                                     ? BussinessIcon
//                                     : item.index === 2
//                                       ? BankIcon
//                                       : item.index === 3
//                                         ? APIKeyIcon
//                                         : item.index === 4
//                                           ? ConfigurationIcon
//                                           : item.index === 5
//                                             ? CustomizationIcon
//                                             : item.index === 6
//                                               ? ConfigurationIcon
//                                               : item.index === 7
//                                                 ? ConfigurationIcon
//                                                 : item.index === 8
//                                                   ? WebhookIcon
//                                                   : item.index === 9
//                                                     ? UsersIcon
//                                                     : ConfigurationIcon
//                               }
//                               width={10}
//                               height={10}
//                               className="mr-2"
//                             />
//                             {item.name}
//                           </div>
//                           <div className="text-muted font-14 py-1 pl-3 ml-3">
//                             {item.description}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </Can>
//               )
//             )}
//           </Header>
//           <Body className="col pl-3 overflow-auto">
//             {active === 0 && (
//               <PersonalDetails
//                 updateUser={(params) => props.updateUser(params)}
//                 user_details={props.user_details}
//                 recoverPassword={props.recoverPassword}
//                 personalProcess={personalProcess}
//                 setPersonalProcess={setPersonalProcess}
//               />
//             )}
//             {active === 1 && (
//               <BusinessDetails
//                 updateBusiness={(params) => props.updateBusiness(params)}
//                 business_details={props.business_details}
//                 industry_list={
//                   props.industry_list && props.industry_list.payload
//                 }
//                 kyc={props.kyc && props.kyc.payload}
//                 countries={props.countries && props.countries.payload}
//                 addressProcess={addressProcess}
//                 setAddressProcess={setAddressProcess}
//                 contactProcess={contactProcess}
//                 setContactProcess={setContactProcess}
//                 kycProcess={kycProcess}
//                 setKycProcess={setKycProcess}
//                 informationProcess={informationProcess}
//                 setInformationProcess={setInformationProcess}
//                 setLogoProcess={setLogoProcess}
//                 setProgress={setProgress}
//                 progress={progress}
//                 logoProcess={logoProcess}
//               />
//             )}
//             {active === 2 && (
//               <BankDetails
//                 updateBusiness={(params) => props.updateBusiness(params)}
//                 nameInquiry={props.nameInquiry}
//                 error_details={props.error_details}
//                 location={props.location}
//                 business_details={props.business_details}
//                 bank_list={props.bank_list && props.bank_list.payload}
//                 name_inquiry={props.name_inquiry || props.error_details}
//                 bankProcess={bankProcess}
//                 setBankProcess={setBankProcess}
//               />
//             )}
//             <Can access={"VIEW_API_KEYS"}>
//               {active === 3 && (
//                 <APIKeys
//                   business_details={props.business_details}
//                   resetKeys={props.resetKeys}
//                   apiKeyProcess={apiKeyProcess}
//                   setApiKeyProcess={setApiKeyProcess}
//                 />
//               )}
//             </Can>
//             <Can access={"FEE_SETUP"}>
//               {active === 4 && (
//                 <PaymentConfig
//                   updateBusiness={props.updateBusiness}
//                   business_details={props.business_details}
//                   updateSettlement={props.updateSettlement}
//                   configProcess={configProcess}
//                   setConfigProcess={setConfigProcess}
//                 />
//               )}
//             </Can>
//             {active === 5 && (
//               <Customization
//                 updateBusiness={props.updateBusiness}
//                 business_details={props.business_details}
//                 customProcess={customProcess}
//                 setCustomProcess={setCustomProcess}
//                 white_label={props.white_label || Brand.default}
//               />
//             )}
//             {active === 6 && (
//               <Ads
//                 loading={loading}
//                 users={props.business_users && props.business_users.payload}
//                 inviteUser={props.inviteUser}
//                 roles={props.roles && props.roles.payload}
//                 user_permissions={props.user_permissions}
//                 updateRole={props.updateRole}
//                 addRole={props.addRole}
//                 updateUserRole={props.updateUserRole}
//                 branches={props.branches && props.branches.payload}
//                 fixUserToBranch={props.fixUserToBranch}
//                 business_number={props.business_details.number}
//                 switchUserMode={props.switchUserMode}
//                 roleProcess={roleProcess}
//                 setRoleProcess={setRoleProcess}
//                 userProcess={userProcess}
//                 setUserProcess={setUserProcess}
//                 inviteProcess={inviteProcess}
//                 setInviteProcess={setInviteProcess}
//                 user_details={props.user_details}
//                 primary_user={props.primary_user}
//               />
//             )}
//             {active === 7 && (
//               <PreAuth
//                 updateBusiness={props.updateBusiness}
//                 business_details={props.business_details}
//                 preAuthProcess={preAuthProcess}
//                 setPreAuthProcess={setPreAuthProcess}
//               />
//             )}
//             <Can access={"VIEW_API_KEYS"}>
//               {active === 8 && (
//                 <Webhook
//                   updateBusiness={(params) => props.updateBusiness(params)}
//                   business_details={props.business_details}
//                   webhookProcess={webhookProcess}
//                   setWebhookProcess={setWebhookProcess}
//                 />
//               )}
//             </Can>
//             {active === 9 && (
//               <UserManagement
//                 users={props.business_users && props.business_users.payload}
//                 inviteUser={props.inviteUser}
//                 roles={props.roles && props.roles.payload}
//                 user_permissions={props.user_permissions}
//                 updateRole={props.updateRole}
//                 addRole={props.addRole}
//                 updateUserRole={props.updateUserRole}
//                 branches={props.branches && props.branches.payload}
//                 fixUserToBranch={props.fixUserToBranch}
//                 business_number={props.business_details.number}
//                 switchUserMode={props.switchUserMode}
//                 roleProcess={roleProcess}
//                 setRoleProcess={setRoleProcess}
//                 userProcess={userProcess}
//                 setUserProcess={setUserProcess}
//                 inviteProcess={inviteProcess}
//                 setInviteProcess={setInviteProcess}
//                 user_details={props.user_details}
//                 primary_user={props.primary_user}
//               />
//             )}
//           </Body>
//         </div>
//       </NavMenuItem>
//     </Wrapper>
//   );
// }
//
// Settings.propTypes = {
//   updateUser: PropTypes.func.isRequired,
//   updateBusiness: PropTypes.func.isRequired,
//   getKYC: PropTypes.func.isRequired,
//   getBusinessUsers: PropTypes.func.isRequired,
//   getRoles: PropTypes.func.isRequired,
//   getBranches: PropTypes.func.isRequired,
// };
//
// const mapStateToProps = (state) => ({
//   user_details: state.data.user_details,
//   business_details: state.data.business_details,
//   kyc: state.data.kyc,
//   industry_list: state.data.industry_list,
//   countries: state.data.countries,
//   error_details: state.data.error_details,
//   location: state.data.location,
//   bank_list: state.data.bank_list,
//   business_users: state.data.business_users,
//   roles: state.data.roles,
//   user_permissions: state.data.user_permissions,
//   role: state.data.role,
//   recover_password: state.data.recover_password,
//   name_inquiry: state.data.name_inquiry,
//   branches: state.data.branches,
//   white_label: state.data.white_label,
//   primary_user: state.data.business_details.primaryUser,
// });
//
// export default connect(mapStateToProps, {
//   clearState,
//   updateUser,
//   getKYC,
//   updateBusiness,
//   getIndustries,
//   getCountries,
//   getBankList,
//   resetKeys,
//   getBusinessUsers,
//   inviteUser,
//   getRoles,
//   updateRole,
//   addRole,
//   recoverPassword,
//   nameInquiry,
//   updateUserRole,
//   getBranches,
//   fixUserToBranch,
//   switchUserMode,
//   getBusiness,
//   updateSettlement
// })(Settings);
