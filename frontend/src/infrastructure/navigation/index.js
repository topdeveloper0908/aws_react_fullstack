import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { AuthenticationContext } from "../../services/authentication/authentication.context";
import { HomeScreen } from "../../features/home/screens/HomeScreen";
import { RegisterScreen } from "../../features/register/screens/Register.screen";
import { LoginScreen } from "../../features/login/Login.screen";
import { ModLoginScreen } from "../../features/login-moderator/ModLogin.screen";
import { Navbar } from "../../components/navbar/Navbar";
import { Profile } from "../../features/profiles/screens/Profile.screen";
import { AccountSettings } from "../../features/account-settings/AccountSettings.screen";
import { OtherUserProfile } from "../../features/profiles/screens/OtherUserProfile.screen";
import { EventViewScreen } from "../../features/events/screens/EventView.screen";
import { EventRequestsScreen } from "../../features/event-requests/screens/EventRequests.screen";
import { SearchScreen } from "../../features/search/screens/Search.screen";
import { UserTypeOptions } from "../../features/user-type-selection/components/UserTypeOptions";
import { ContactUs } from "../../features/contact-us/ContactUs.screen";
import { TermsAndConditionsScreen } from "../../features/terms-and-conditions/TermsAndConditions.screen";
import { ModDashboardScreen } from "../../features/mod-dashboard/screens/dashboard/ModDashboard.screen";
import { OnboardingModalScreen } from "../../features/onboarding/screens/OnboardingModal.screen";
import { ForgotPasswordScreen } from "../../features/password-reset/screens/forgot-password/ForgotPassword.screen";
import { ResetPasswordScreen } from "../../features/password-reset/screens/reset-password/ResetPassword.screen";
import { AccountExecutiveDashboard } from "../../features/account-executive-dashboard/AccountExecutiveDashboard.screen";
import { MessageThread } from "../../features/messaging/MessageThread.screen";
import { AllMessageThreadsScreen } from "../../features/messaging/AllMessageThreads.screen";
import { Four04Page } from "../../components/404/404page.screen";
import { PaginatedList } from "../../features/mod-dashboard/screens/paginated-list/PaginatedList.screen";

export const Navigation = () => {
	const {
		userType,
		user,
		isAuthenticated,
		isAuthenticatedMod,
		messageThreads,
	} = useContext(AuthenticationContext);

	return (
		<Router>
			{userType && <Navbar />}
			{isAuthenticated && user && user.isAccountExec && (
				<OnboardingModalScreen />
			)}
			<Switch>
				<Route path="/search">
					<SearchScreen />
				</Route>
				<Route path="/login">
					{!isAuthenticated ? <LoginScreen /> : <Profile />}
				</Route>
				<Route path="/forgot-password">
					<ForgotPasswordScreen />
				</Route>
				<Route path="/reset-password">
					<ResetPasswordScreen />
				</Route>
				<Route path="/login-as-moderator">
					{isAuthenticatedMod ? <ModDashboardScreen /> : <ModLoginScreen />}
				</Route>
				<Route path="/register">
					{!isAuthenticated ? <RegisterScreen /> : <Profile />}
				</Route>
				<Route path="/profile">
					{isAuthenticated && user ? <Profile /> : <LoginScreen />}
				</Route>
				<Route path="/accountsettings">
					{isAuthenticated && user ? <AccountSettings /> : <LoginScreen />}
				</Route>
				<Route path="/eventrequests">
					{isAuthenticated && user ? <EventRequestsScreen /> : <LoginScreen />}
				</Route>
				<Route path="/results">
					<SearchScreen />
				</Route>
				<Route path="/user">
					<OtherUserProfile />
				</Route>
				<Route path="/event">
					<EventViewScreen />
				</Route>
				<Route path="/contact">
					<ContactUs />
				</Route>
				<Route path="/termsandconditions">
					<TermsAndConditionsScreen />
				</Route>
				<Route path="/account-exec-dashboard">
					{isAuthenticated && user && user.isAccountExec ? (
						<AccountExecutiveDashboard />
					) : (
						<Four04Page />
					)}
				</Route>
				<Route path="/allmessages">
					{isAuthenticated && user && messageThreads ? (
						<AllMessageThreadsScreen />
					) : null}
				</Route>
				<Route path="/message">
					{isAuthenticated && user ? <MessageThread /> : null}
				</Route>
				<Route path="/moddashboard/new-users">
					{isAuthenticatedMod ? (
						<PaginatedList documentType={"new_users"} />
					) : (
						<Four04Page />
					)}
				</Route>
				<Route path="/moddashboard/newly-updated-users">
					{isAuthenticatedMod ? (
						<PaginatedList documentType={"newly_updated_users"} />
					) : (
						<Four04Page />
					)}
				</Route>
				<Route path="/moddashboard/suspended-users">
					{isAuthenticatedMod ? (
						<PaginatedList documentType={"suspended_users"} />
					) : (
						<Four04Page />
					)}
				</Route>
				<Route path="/moddashboard/reported-users">
					{isAuthenticatedMod ? (
						<PaginatedList documentType={"reported_users"} />
					) : (
						<Four04Page />
					)}
				</Route>
				<Route path="/moddashboard/events">
					{isAuthenticatedMod ? (
						<PaginatedList documentType={"events"} />
					) : (
						<Four04Page />
					)}
				</Route>
				<Route path="/moddashboard/account-executives">
					{isAuthenticatedMod ? (
						<PaginatedList documentType={"account_executives"} />
					) : (
						<Four04Page />
					)}
				</Route>
				<Route path="/moddashboard/moderators">
					{isAuthenticatedMod ? (
						<PaginatedList documentType={"moderators"} />
					) : (
						<Four04Page />
					)}
				</Route>
				<Route path="/moddashboard/all-reports">
					{isAuthenticatedMod ? (
						<PaginatedList documentType={"all_reports"} />
					) : (
						<Four04Page />
					)}
				</Route>
				<Route path="/moddashboard/unresolved-reports">
					{isAuthenticatedMod ? (
						<PaginatedList documentType={"unresolved_reports"} />
					) : (
						<Four04Page />
					)}
				</Route>
				<Route path="/moddashboard/resolved-reports">
					{isAuthenticatedMod ? (
						<PaginatedList documentType={"resolved_reports"} />
					) : (
						<Four04Page />
					)}
				</Route>
				<Route path="/moddashboard">
					{isAuthenticatedMod ? <ModDashboardScreen /> : <ModLoginScreen />}
				</Route>
				<Route path="/">
					{userType ? <HomeScreen /> : <UserTypeOptions />}
				</Route>
			</Switch>
		</Router>
	);
};
