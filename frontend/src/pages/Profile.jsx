import { useState } from "react";
import { User, MapPin, Bell, Award, Settings, Mail, Phone } from "lucide-react";
import useAuth from "../hooks/useAuth";

const Profile = () => {
   const { user } = useAuth();
   const [activeTab, setActiveTab] = useState("profile");
   const [profile, setProfile] = useState({
      name: user?.full_name || "User",
      email: user?.email || "",
      phone: user?.phone || "",
      location: user?.location || "",
      bio: user?.bio || "",
      joinDate: user?.created_at
         ? new Date(user.created_at).toLocaleDateString("en-US")
         : "2024-01-01",
   });

   const [notifications, setNotifications] = useState({
      emailAlerts: true,
      whatsappAlerts: false,
      weeklyReports: true,
      communityUpdates: true,
   });

   const tabs = [
      { id: "profile", label: "Profile", icon: User },
      { id: "achievements", label: "Achievements", icon: Award },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "settings", label: "Settings", icon: Settings },
   ];

   const achievements = [
      {
         id: 1,
         title: "First Observer",
         description: "Made your first community observation",
         icon: Leaf,
         earned: true,
         date: "2024-01-05",
      },
      {
         id: 2,
         title: "Environmental Guardian",
         description: "Contributed with 10 verified observations",
         icon: "🛡️",
         earned: false,
         progress: 3,
      },
      {
         id: 3,
         title: "Data Explorer",
         description: "Viewed NDVI data for 30 consecutive days",
         icon: BarChart3,
         earned: false,
         progress: 15,
      },
      {
         id: 4,
         title: "Active Collaborator",
         description: "Validated 50 observations from other users",
         icon: "🤝",
         earned: false,
         progress: 0,
      },
   ];

   const stats = {
      observations: user?.observation_count || 0,
      validations: user?.validation_count || 0,
      points: user?.points || 0,
      areasMonitored: user?.areas_monitored || 0,
   };

   const handleProfileUpdate = (e) => {
      e.preventDefault();
   };

   const handleNotificationUpdate = (key) => {
      setNotifications((prev) => ({
         ...prev,
         [key]: !prev[key],
      }));
   };

   return (
      <div className="space-y-8">
         {/* Header */}
         <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
               <User className="w-12 h-12 text-primary-600" />
            </div>
            <div>
               <h1 className="text-3xl font-bold text-gray-900">
                  {profile.name}
               </h1>
               <p className="text-gray-600">{profile.location}</p>
            </div>
         </div>

         {/* Stats */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center">
               <p className="text-2xl font-bold text-primary-600">
                  {stats.observations}
               </p>
               <p className="text-sm text-gray-600">Observations</p>
            </div>
            <div className="card text-center">
               <p className="text-2xl font-bold text-blue-600">
                  {stats.validations}
               </p>
               <p className="text-sm text-gray-600">Validations</p>
            </div>
            <div className="card text-center">
               <p className="text-2xl font-bold text-green-600">
                  {stats.points}
               </p>
               <p className="text-sm text-gray-600">Points</p>
            </div>
            <div className="card text-center">
               <p className="text-2xl font-bold text-purple-600">
                  {stats.areasMonitored}
               </p>
               <p className="text-sm text-gray-600">Monitored Areas</p>
            </div>
         </div>

         {/* Tabs */}
         <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
               {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                           activeTab === tab.id
                              ? "border-primary-500 text-primary-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                     >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                     </button>
                  );
               })}
            </nav>
         </div>

         {/* Tab Content */}
         {activeTab === "profile" && (
            <div className="max-w-2xl mx-auto">
               <div className="card">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                     Profile Information
                  </h2>

                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                     <div className="grid md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name
                           </label>
                           <input
                              type="text"
                              value={profile.name}
                              onChange={(e) =>
                                 setProfile({
                                    ...profile,
                                    name: e.target.value,
                                 })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                           />
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              Location
                           </label>
                           <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                 type="text"
                                 value={profile.location}
                                 onChange={(e) =>
                                    setProfile({
                                       ...profile,
                                       location: e.target.value,
                                    })
                                 }
                                 className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="grid md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email
                           </label>
                           <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                 type="email"
                                 value={profile.email}
                                 onChange={(e) =>
                                    setProfile({
                                       ...profile,
                                       email: e.target.value,
                                    })
                                 }
                                 className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              />
                           </div>
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone
                           </label>
                           <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                 type="tel"
                                 value={profile.phone}
                                 onChange={(e) =>
                                    setProfile({
                                       ...profile,
                                       phone: e.target.value,
                                    })
                                 }
                                 className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              />
                           </div>
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Biography
                        </label>
                        <textarea
                           value={profile.bio}
                           onChange={(e) =>
                              setProfile({ ...profile, bio: e.target.value })
                           }
                           rows={3}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                     </div>

                     <button type="submit" className="btn-primary px-6 py-2">
                        Save Changes
                     </button>
                  </form>
               </div>
            </div>
         )}

         {activeTab === "achievements" && (
            <div className="space-y-6">
               <h2 className="text-xl font-semibold text-gray-900">
                  Achievements
               </h2>

               <div className="grid md:grid-cols-2 gap-6">
                  {achievements.map((achievement) => (
                     <div
                        key={achievement.id}
                        className={`card ${achievement.earned ? "bg-green-50 border-green-200" : ""}`}
                     >
                        <div className="flex items-start space-x-4">
                           <div className="text-3xl">{achievement.icon}</div>
                           <div className="flex-1">
                              <h3
                                 className={`font-semibold ${achievement.earned ? "text-green-800" : "text-gray-900"}`}
                              >
                                 {achievement.title}
                              </h3>
                              <p
                                 className={`text-sm ${achievement.earned ? "text-green-600" : "text-gray-600"}`}
                              >
                                 {achievement.description}
                              </p>

                              {achievement.earned ? (
                                 <p className="text-xs text-green-500 mt-2">
                                    Earned on {achievement.date}
                                 </p>
                              ) : (
                                 <div className="mt-2">
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                       <span>Progress</span>
                                       <span>
                                          {achievement.progress || 0}/
                                          {achievement.id === 2
                                             ? 10
                                             : achievement.id === 3
                                               ? 30
                                               : 50}
                                       </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                       <div
                                          className="bg-primary-600 h-2 rounded-full"
                                          style={{
                                             width: `${((achievement.progress || 0) / (achievement.id === 2 ? 10 : achievement.id === 3 ? 30 : 50)) * 100}%`,
                                          }}
                                       ></div>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {activeTab === "notifications" && (
            <div className="max-w-2xl mx-auto">
               <div className="card">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                     Notification Preferences
                  </h2>

                  <div className="space-y-6">
                     {Object.entries({
                        emailAlerts: "Email Alerts",
                        whatsappAlerts: "WhatsApp Alerts",
                        weeklyReports: "Weekly Reports",
                        communityUpdates: "Community Updates",
                     }).map(([key, label]) => (
                        <div
                           key={key}
                           className="flex items-center justify-between"
                        >
                           <div>
                              <p className="font-medium text-gray-900">
                                 {label}
                              </p>
                              <p className="text-sm text-gray-500">
                                 {key === "emailAlerts" &&
                                    "Receive important alerts by email"}
                                 {key === "whatsappAlerts" &&
                                    "Receive notifications via WhatsApp"}
                                 {key === "weeklyReports" &&
                                    "Weekly report with activity summary"}
                                 {key === "communityUpdates" &&
                                    "News and community updates"}
                              </p>
                           </div>
                           <button
                              onClick={() => handleNotificationUpdate(key)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                 notifications[key]
                                    ? "bg-primary-600"
                                    : "bg-gray-200"
                              }`}
                           >
                              <span
                                 className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    notifications[key]
                                       ? "translate-x-6"
                                       : "translate-x-1"
                                 }`}
                              />
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {activeTab === "settings" && (
            <div className="text-center py-12">
               <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Advanced Settings
               </h3>
               <p className="text-gray-500">Feature under development</p>
            </div>
         )}
      </div>
   );
};

export default Profile;
