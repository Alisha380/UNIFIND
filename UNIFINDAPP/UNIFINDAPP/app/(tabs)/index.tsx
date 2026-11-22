import { File } from 'expo-file-system';
import { getItems, createReport, updateReport, deleteReport } from '../../utils/api';
import { filterReports } from '../../utils/filterReports';
import { validateReportForm } from '../../utils/validation';
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// --- IMPORTS FROM LOCAL FILES ---
import {
  AUTH_BG,
  FormState,
  LOGO_DURATION,
  LOGO_IMG,
  MASTER_DATABASE,
  SLIDE_INTERVAL,
  slides,
  UniItem
} from '../../constants/data'; // Ye 'constants' folder mein check karega

import { styles } from '../../components/UniViews'; // Ye 'components' folder mein check karega

// --- PREMIUM ICON SET ---
import {
  ArrowRight, CheckCircle2, Compass, ExternalLink, Globe, HelpCircle,
  Info, Layers, Lock, MapPin, Plus, Search, Send, ShieldAlert,
  ShieldCheck, User, X, Zap
} from 'lucide-react-native';
import { fetch } from 'expo/fetch';
const { width, height } = Dimensions.get("window");
// Is address ko index.tsx mein line 50 ke aas paas update karein
const API_URL = "http://192.168.100.9:3000";
export default function App() {
      const [form, setForm] = useState<any>({ // FormState ki jagah 'any' likh dein

        id: null,
  name: '',
  email: '',
  msg: '',
  type: 'Found',
  item_name: '',
  location: '',
  image_url: ''
});
const [errors, setErrors] = useState<any>({});


const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (result.canceled) return;

    try {
        const asset = result.assets[0];

        const imageFile = new File(asset.uri);

        const formData = new FormData();

        formData.append(
            'image',
            imageFile,
            asset.fileName || `image-${Date.now()}.jpg`
        );

        const response = await fetch(`${API_URL}/items/upload`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Image upload failed');
        }

        setForm((prev: any) => ({
            ...prev,
            image_url: data.image_url,
        }));

        Alert.alert('Success', 'Image uploaded successfully!');
    } catch (error) {
        console.error('Image upload failed:', error);
        Alert.alert('Upload Failed', 'Please check backend and try again.');
    }
};




const handleSubmit = async () => {
  // 1. Logic check: Agar id hai toh update (PUT), warna naya (POST)
  const isUpdate = form.id !== null && form.id !== undefined;

  try {
    const response = isUpdate
      ? await updateReport(API_URL, form.id, form)
      : await createReport(API_URL, form);

    if (response.ok) {
      alert(isUpdate ? "Data Updated Successfully!" : "Report Registered!");

      // 2. Discovery page ko foran update karne ke liye
      await fetchItems();

      // 3. Wapis Discovery page par bhejne ke liye
      setActiveTab('Discovery');

      // Note: Hum yahan form reset nahi kar rahe taake apki logic distrub na ho
    } else {
      alert("Submission failed. Please check server.");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Network error. Make sure backend is running.");
  }
};

    const [stage, setStage] = useState("logo");
    const [isLogin, setIsLogin] = useState(false);
   const [dbItems, setDbItems] = useState<any[]>([]); // Khali brackets [] hona zaroori hain
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAuthSheet, setShowAuthSheet] = useState(false);
    const [time, setTime] = useState("");

    // Form States
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Global App States
    const [activeTab, setActiveTab] = useState<'Home' | 'About' | 'Discovery' | 'Report'>('Home');
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<UniItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'All' | 'Lost' | 'Found'>('All');
    const [showProfileModal, setShowProfileModal] = useState(false);

    const flatListRef = useRef<FlatList>(null);
    const progressWidth = useRef(new Animated.Value(0)).current;
    const sheetTranslateY = useRef(new Animated.Value(height * 0.7)).current;
    const sheetScale = useRef(new Animated.Value(0.9)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Logout confirmation and return to the Welcome Back screen
    const handleLogout = () => {
        setShowProfileModal(false);
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: () => {
                        setSelectedItem(null);
                        setActiveTab('Home');
                        setSearchQuery('');
                        setActiveFilter('All');
                        setForm({ id: null, name: '', email: '', msg: '', type: 'Found', item_name: '', location: '', image_url: '' });
                        setErrors({});
                        setIsLogin(false);
                        setShowAuthSheet(false);
                        progressWidth.setValue(0);
                        sheetTranslateY.setValue(height * 0.7);
                        sheetScale.setValue(0.9);
                        contentOpacity.setValue(0);
                        setStage("intro");
                    }
                }
            ]
        );
    };

    // Backend-connected Login and Signup
    const handleAuth = async () => {
        if (isLogin) {
            if (!email.trim() || !password.trim()) {
                Alert.alert("Error", "Please fill all fields to Login");
                return;
            }
        } else {
            if (
                !firstName.trim() ||
                !lastName.trim() ||
                !email.trim() ||
                !username.trim() ||
                !password.trim() ||
                !confirmPassword.trim()
            ) {
                Alert.alert("Error", "All fields are required to Create Account");
                return;
            }

            if (password !== confirmPassword) {
                Alert.alert("Error", "Passwords do not match");
                return;
            }

            if (password.length < 8) {
                Alert.alert("Error", "Password must be at least 8 characters.");
                return;
            }
        }

        try {
            const endpoint = isLogin ? "/auth/login" : "/auth/signup";

            const body = isLogin
                ? {
                    email: email.trim().toLowerCase(),
                    password
                }
                : {
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                    email: email.trim().toLowerCase(),
                    username: username.trim(),
                    password
                };

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert(
                    "Authentication Failed",
                    data.message || "Something went wrong."
                );
                return;
            }

            if (data.user) {
                setFirstName(data.user.first_name || "");
                setLastName(data.user.last_name || "");
                setEmail(data.user.email || "");
                setUsername(data.user.username || "");
            }

            Alert.alert(
                "Success",
                data.message || "Authentication successful!"
            );

            setStage("main");
        } catch (error) {
            console.error("Authentication Error:", error);
            Alert.alert(
                "Connection Error",
                "Unable to connect to server. Please check that the backend is running and your phone and laptop are on the same Wi-Fi."
            );
        }
    };

    useEffect(() => {
        if (stage === "logo") setTimeout(() => setStage("slider"), LOGO_DURATION);
    }, [stage]);

    useEffect(() => {
        if (stage === "slider") {
            const interval = setInterval(() => {
                if (currentIndex < slides.length - 1) {
                  const next = currentIndex + 1;
                  flatListRef.current?.scrollToIndex({ index: next, animated: true });
                  setCurrentIndex(next);
                } else {
                  clearInterval(interval);
                  setTimeout(() => setStage("intro"), 500);
                }
            }, SLIDE_INTERVAL);
            return () => clearInterval(interval);
        }
    }, [currentIndex, stage]);

    useEffect(() => {
        if (stage === "intro") {
            Animated.timing(progressWidth, {
                toValue: 1,
                duration: 1800,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: false,
            }).start(() => {
                setShowAuthSheet(true);
                Animated.parallel([
                  Animated.spring(sheetTranslateY, { toValue: 0, tension: 45, friction: 9, useNativeDriver: true }),
                  Animated.spring(sheetScale, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
                  Animated.timing(contentOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
                ]).start();
            });
        }
    }, [stage]);

 const fetchItems = async () => {
            try {
              const data = await getItems(API_URL);

                // Important: Dummy data ki jagah ab hum DB wala data set karenge
                setDbItems(data);

                setLoading(false);
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }).start();
            } catch (error) {
                console.error("Fetch error:", error);
                setLoading(false);
            }
        };


useEffect(() => {
    if (stage === "main") {
      fetchItems();
    }
  }, [stage]);
 const handleEdit = (item: any) => {
    // Form mein purana data bharne ke liye
    setForm({
        id: item.id, // Update ke liye ID lazmi hai
        name: item.name || '',
        email: item.email || '',
        item_name: item.item_name || '',
        location: item.location || '',
        category: item.category || 'General',
        type: item.type || 'Found',
        msg: item.msg || '',
        image_url: item.image_url || ''
    });

    // Report tab par switch karne ke liye
    setActiveTab('Report');
};

const deleteItem = async (id: number) => {
    Alert.alert(
        "Delete Report",
        "Are you sure you want to delete report?",
        [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        const response = await deleteReport(API_URL, id);

                        if (response.ok) {
                            setDbItems(prev => prev.filter(item => item.id !== id));
                            Alert.alert("Success", "Report is deleted");
                        }
                    } catch (error) {
                        console.error("Delete failed:", error);
                    }
                }
            }
        ]
    );
};


    const filteredData = useMemo(() => {
  return filterReports(dbItems, searchQuery, activeFilter);
}, [searchQuery, activeFilter, dbItems]);
    const barWidth = progressWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    // --- SCREEN RENDERERS (Inside App for Scope) ---
    const RenderHome = () => (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.flex1}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200' }}
            style={styles.heroSection}
          >
            <View style={styles.heroOverlay}>
              <View style={styles.proBadge}>
                <Zap size={14} color="#60a5fa" fill="#60a5fa" />
                <Text style={styles.proBadgeText}>SECURE PROTOCOL v4.0</Text>
              </View>
              <Text style={styles.heroTitle}>Your Assets.{'\n'}Recovered.</Text>
              <Text style={styles.heroLead}>The university's centralized network for lost and found property management.</Text>
              <View style={styles.heroActions}>
                <TouchableOpacity style={styles.btnPrimary} onPress={() => setActiveTab('Discovery')}>
                  <Text style={styles.btnPrimaryText}>Explore Feed</Text>
                  <ArrowRight size={18} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
          <View style={styles.homeContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <CheckCircle2 color="#10b981" size={24} />
                <Text style={styles.statNum}>1.4k</Text>
                <Text style={styles.statLab}>Recovered</Text>
              </View>
              <View style={styles.statBox}>
                <ShieldCheck color="#3b82f6" size={24} />
                <Text style={styles.statNum}>98%</Text>
                <Text style={styles.statLab}>Security Score</Text>
              </View>
            </View>
            <Text style={styles.sectionHeader}>Priority Reports</Text>
            {MASTER_DATABASE.slice(0, 3).map(item => (
              <TouchableOpacity key={item.id} style={styles.priorityCard} onPress={() => setSelectedItem(item)}>
                <Image source={{ uri: item.image }} style={styles.priorityImg} />
                <View style={styles.priorityInfo}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.priorityCat}>{item.category}</Text>
                    <Text style={styles.priorityTime}>{item.timestamp}</Text>
                  </View>
                  <Text style={styles.priorityTitle}>{item.name}</Text>
                  <View style={styles.row}>
                    <MapPin size={12} color="#94a3b8" />
                    <Text style={styles.priorityLoc}>{item.location}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.securityBanner}>
                <ShieldAlert color="#fff" size={24} />
                <View style={{ marginLeft: 15 }}>
                  <Text style={styles.bannerTitle}>Security Advisory</Text>
                  <Text style={styles.bannerText}>Always verify your ID at the main office.</Text>
                </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
    );

    const RenderAbout = () => (
        <ScrollView style={styles.flex1} contentContainerStyle={{ padding: 25, paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.screenHeading}>About UniFind</Text>
          <View style={styles.aboutHero}>
            <Globe size={60} color="#3b82f6" strokeWidth={1.5} />
            <Text style={styles.aboutTagline}>Enterprise Asset Recovery</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Our Mission</Text>
            <Text style={styles.infoPara}>UniFind is designed to bridge the gap between lost property and their owners through high-speed digital tracking and verified security protocols.</Text>
          </View>
          <View style={styles.featureGrid}>
            <View style={styles.featItem}>
              <Lock size={24} color="#10b981" />
              <Text style={styles.featTitle}>Encryption</Text>
              <Text style={styles.featDesc}>End-to-end data security for students.</Text>
            </View>
            <View style={styles.featItem}>
              <Zap size={24} color="#f59e0b" />
              <Text style={styles.featTitle}>Real-time</Text>
              <Text style={styles.featDesc}>Instant broadcast to all security nodes.</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openURL('https://google.com')}>
            <Text style={styles.linkText}>View Official Policy</Text>
            <ExternalLink size={16} color="#3b82f6" />
          </TouchableOpacity>
        </ScrollView>
    );

    const RenderDiscovery = () => (
        <View style={styles.flex1}>
          <View style={styles.discoveryHeader}>
            <Text style={styles.screenHeading}>Discovery</Text>
            <View style={styles.searchBox}>
              <Search color="#94a3b8" size={20} />
              <TextInput
                style={styles.searchField}
                placeholder="Search items or locations..."
                placeholderTextColor="#64748b"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
              {['All', 'Found', 'Lost'].map(f => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setActiveFilter(f as any)}
                  style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
                >
                  <Text style={[styles.filterLabel, activeFilter === f && styles.filterLabelActive]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

<FlatList
  data={filteredData}
  keyExtractor={item => item.id.toString()} // Database ID string ya number ho sakti hai
  renderItem={({ item }) => (
    <TouchableOpacity style={styles.discoveryCard} onPress={() => setSelectedItem(item)}>
      {/* Image: DB column 'image_url' use karein */}
      <Image source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} style={styles.discoveryImg} />

      <View style={styles.discoveryBody}>
        <View style={styles.rowBetween}>
          <Text style={styles.discCat}>{item.category || "General"}</Text>

          {/* Status: DB column 'type' use karein (Found/Lost) */}
          <View style={[styles.statusIndicator, { backgroundColor: item.type === 'Lost' ? '#ef4444' : '#10b981' }]}>
            <Text style={styles.statusText}>{item.type}</Text>
          </View>
         {/* Action Buttons Row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>

            {/* Edit Button */}
            <TouchableOpacity
              onPress={() => handleEdit(item)}
              style={{ marginRight: 20 }}
            >
              <Ionicons name="create-outline" size={22} color="#3b82f6" />
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={() => deleteItem(item.id)}
            >
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>

          </View>
          </View>

        {/* Title: DB column 'item_name' use karein */}
        <Text style={styles.discTitle}>{item.item_name}</Text>

        <View style={styles.row}>
          <MapPin size={12} color="#94a3b8" />
          <Text style={styles.discLoc}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )}
  contentContainerStyle={{ padding: 25, paddingBottom: 120 }}
  ListEmptyComponent={
    <View style={styles.emptyContainer}>
      <HelpCircle size={60} color="#334155" />
      <Text style={styles.emptyText}>No assets found matching your criteria.</Text>
    </View>
  }
/>
        </View>
    );


    if (stage === "logo") return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Image source={LOGO_IMG} style={styles.absoluteFill} resizeMode="cover" />
        </View>
    );

    if (stage === "slider") return (
        <View style={styles.container}>
            <StatusBar hidden />
            <FlatList
                ref={flatListRef}
                data={slides}
                horizontal
                pagingEnabled
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Image source={item.image} style={{ width, height }} resizeMode="cover" />}
            />
        </View>
    );

    if (stage === "intro") return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Image source={LOGO_IMG} style={styles.absoluteFill} resizeMode="cover" />
            {!showAuthSheet && (
                <View style={styles.loadingTrack}>
                  <Animated.View style={[styles.loadingFill, { width: barWidth }]} />
                </View>
            )}
            {showAuthSheet && (
                <Animated.View style={[styles.authSheet, { opacity: contentOpacity, transform: [{ translateY: sheetTranslateY }, { scale: sheetScale }] }]}>
                  <View style={styles.handleBar} />
                  <View style={styles.contentWrapper}>
                      <Text style={styles.mainTitle}>Welcome Back</Text>
                      <Text style={styles.mainSubtitle}>Join thousands of explorers discovering unique local experiences.</Text>
                      <TouchableOpacity style={styles.btnPrimaryAuth} onPress={() => { setIsLogin(true); setStage("auth"); }}>
                          <Text style={styles.btnPrimaryTextAuth}>Continue with Email</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.btnOutline} onPress={() => { setIsLogin(false); setStage("auth"); }}>
                          <Text style={styles.btnOutlineText}>Create New Account</Text>
                      </TouchableOpacity>
                      <View style={styles.dividerContainer}>
                          <View style={styles.dividerLine} /><Text style={styles.dividerText}>OR</Text><View style={styles.dividerLine} />
                      </View>
                      <View style={styles.socialContainer}>
                          <SocialIcon name="google" color="#EA4335" type="AntDesign" />
                          <SocialIcon name="logo-apple" color="#000000" type="Ionicons" />
                          <SocialIcon name="facebook" color="#1877F2" type="FontAwesome" />
                      </View>
                  </View>
                </Animated.View>
            )}
        </View>
    );

    if (stage === "auth") return (
        <ImageBackground source={AUTH_BG} style={styles.container} resizeMode="cover">
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <BlurView intensity={60} tint="dark" style={styles.card}>
                  <TouchableOpacity onPress={() => setStage("intro")} style={{ marginBottom: 15 }}>
                      <Text style={{ color: "#fff", fontSize: 14 }}>â† Back</Text>
                  </TouchableOpacity>
                  <Text style={styles.logoText}>Lost n Found</Text>
                  <Text style={styles.titleText}>{isLogin ? "Welcome Back" : "Create Your Account"}</Text>
                  {!isLogin && (
                      <View style={styles.row}>
                          <TextInput placeholder="First Name" placeholderTextColor="#ccc" style={[styles.input, { flex: 1, marginRight: 8 }]} onChangeText={setFirstName} />
                          <TextInput placeholder="Last Name" placeholderTextColor="#ccc" style={[styles.input, { flex: 1, marginLeft: 8 }]} onChangeText={setLastName} />
                      </View>
                  )}
                  <TextInput placeholder="Email address" placeholderTextColor="#ccc" style={styles.input} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                  {!isLogin && <TextInput placeholder="Username" placeholderTextColor="#ccc" style={styles.input} onChangeText={setUsername} autoCapitalize="none" />}
                  <TextInput placeholder="Password" placeholderTextColor="#ccc" secureTextEntry style={styles.input} onChangeText={setPassword} />
                  {!isLogin && <TextInput placeholder="Confirm Password" placeholderTextColor="#ccc" secureTextEntry style={styles.input} onChangeText={setConfirmPassword} />}
                  {isLogin && <Text style={styles.forgotText}>Forgot Password?</Text>}
                  <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
                      <Text style={styles.authButtonText}>{isLogin ? "Login" : "Create Account"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                      <Text style={styles.switchText}>{isLogin ? "Are you new? Sign Up" : "Already a member? Login"}</Text>
                  </TouchableOpacity>
                </BlurView>
            </View>
        </ImageBackground>
    );

    if (stage === "main") {
        if (loading) {
            return (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loaderText}>INITIALIZING UNIFIND GLOBAL...</Text>
              </View>
            );
        }
        return (
            <SafeAreaView style={styles.mainWrapper}>
              <StatusBar barStyle="light-content" />
              <View style={styles.topAppBar}>
                <View>
                  <Text style={styles.brandTitle}>UNIFIND</Text>
                  <Text style={styles.brandSub}>RIPHAH UNIVERSITY</Text>
                </View>
                <TouchableOpacity style={styles.avatar} onPress={() => setShowProfileModal(true)} accessibilityRole="button" accessibilityLabel="Open profile">
                  <User size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <Animated.View style={[styles.flex1, { opacity: fadeAnim }]}>
                {activeTab === 'Home' && <RenderHome />}
                {activeTab === 'About' && <RenderAbout />}
                {activeTab === 'Discovery' && <RenderDiscovery />}
               {activeTab === 'Report' && (
  <RenderReport
    form={form}
    setForm={setForm}
    errors={errors}
    setErrors={setErrors}
    setActiveTab={setActiveTab}
    pickImage={pickImage}
    handleSubmit={handleSubmit}
  />
)}
              </Animated.View>
              <Modal
                visible={showProfileModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowProfileModal(false)}
              >
                <View style={{ flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.72)', justifyContent: 'center', padding: 24 }}>
                  <View style={{ backgroundColor: '#0f172a', borderRadius: 24, padding: 22, borderWidth: 1, borderColor: '#334155' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                      <Text style={{ color: '#fff', fontSize: 21, fontWeight: '700' }}>My Profile</Text>
                      <TouchableOpacity onPress={() => setShowProfileModal(false)} accessibilityRole="button" accessibilityLabel="Close profile">
                        <X color="#cbd5e1" size={23} />
                      </TouchableOpacity>
                    </View>

                    <View style={{ alignItems: 'center', paddingVertical: 8, marginBottom: 20 }}>
                      <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: '#1e3a8a', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                        <User color="#bfdbfe" size={36} />
                      </View>
                      <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
                        {[firstName, lastName].filter(Boolean).join(' ') || username || 'UniFind User'}
                      </Text>
                      <Text style={{ color: '#94a3b8', fontSize: 13, marginTop: 5 }}>
                        {email || 'Email not provided'}
                      </Text>
                    </View>

                    <View style={{ backgroundColor: '#1e293b', borderRadius: 14, padding: 15, marginBottom: 18 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <ShieldCheck color="#34d399" size={19} />
                        <Text style={{ color: '#e2e8f0', fontSize: 14, marginLeft: 10 }}>UniFind account</Text>
                        <View style={{ flex: 1 }} />
                        <Text style={{ color: '#34d399', fontSize: 12, fontWeight: '600' }}>Active session</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={handleLogout}
                      accessibilityRole="button"
                      accessibilityLabel="Logout"
                      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#7f1d1d', borderRadius: 14, paddingVertical: 15, marginTop: 2 }}
                    >
                      <Ionicons name="log-out-outline" size={20} color="#fff" />
                      <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', marginLeft: 9 }}>Logout</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

<Modal visible={!!selectedItem} transparent animationType="slide">
  <View style={styles.modalBackdrop}>
    <View style={styles.modalSheet}>
      <TouchableOpacity
        style={styles.modalClose}
        onPress={() => setSelectedItem(null)}
      >
        <X color="#fff" size={24} />
      </TouchableOpacity>

      <Image
        source={{
          uri:
            (selectedItem as any)?.image_url ||
            (selectedItem as any)?.image
        }}
        style={styles.modalImg}
      />

      <View style={styles.modalBody}>
        <View style={styles.rowBetween}>
          <Text style={styles.modalCat}>
            {selectedItem?.category}
          </Text>
          <Text style={styles.modalId}>
            {selectedItem?.id}
          </Text>
        </View>

        <Text style={styles.modalTitle}>
          {(selectedItem as any)?.item_name || selectedItem?.name}
        </Text>

        <View style={styles.modalLocRow}>
          <MapPin size={14} color="#3b82f6" />
          <Text style={styles.modalLoc}>
            {selectedItem?.location}
          </Text>
        </View>

        <Text style={styles.modalDesc}>
          {(selectedItem as any)?.msg ||
            (selectedItem as any)?.description ||
            'No description provided.'}
        </Text>

        <View style={styles.reporterCard}>
          <Info size={16} color="#94a3b8" />
          <Text style={styles.reporterText}>
            Reported by: {(selectedItem as any)?.name ||
              (selectedItem as any)?.reporter ||
              'Unknown'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.modalClaimBtn}
          onPress={() =>
            Alert.alert(
              "Claim Process Initiated",
              "Check your student email for verification steps."
            )
          }
        >
          <Text style={styles.modalClaimText}>
            Reclaim This Asset
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

              <View style={styles.bottomNav}>
                <NavButton icon={<Layers />} label="Hub" active={activeTab === 'Home'} onPress={() => setActiveTab('Home')} />
                <NavButton icon={<Compass />} label="Explore" active={activeTab === 'Discovery'} onPress={() => setActiveTab('Discovery')} />
                <NavButton
  icon={<Plus />}
  label="Report"
  active={activeTab === 'Report'}
  onPress={() => {
    setActiveTab('Report');
    // Naya report shuru karne ke liye form ko reset karna zaroori hai
    setForm({
      id: null,
      name: '',
      email: '',
      msg: '',
      type: 'Found',
      item_name: '',
      location: '',
      image_url: '',
    });
    setErrors({});
  }}
/>
                <NavButton icon={<Info />} label="About" active={activeTab === 'About'} onPress={() => setActiveTab('About')} />
              </View>
            </SafeAreaView>
        );
    }
}

// --- SUB-COMPONENTS ---
const SocialIcon = ({ name, color, type }: any) => (
    <TouchableOpacity style={styles.socialCircle}>
        {type === "AntDesign" && <AntDesign name={name} size={24} color={color} />}
        {type === "Ionicons" && <Ionicons name={name} size={24} color={color} />}
        {type === "FontAwesome" && <FontAwesome name={name} size={24} color={color} />}
    </TouchableOpacity>
);

const NavButton = ({ icon, label, active, onPress }: any) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <View style={[styles.navIconBg, active && styles.navIconActive]}>
      {React.cloneElement(icon, { size: 22, color: active ? '#000' : '#64748b', strokeWidth: active ? 2.5 : 2 })}
    </View>
    <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
  </TouchableOpacity>
);
const RenderReport = ({ form, setForm, errors, setErrors, handleSubmit, pickImage, fetchItems, setActiveTab }: any) => {
        const validate = () => {
  const tempErrors = validateReportForm(form);
  setErrors(tempErrors);
  return Object.keys(tempErrors).length === 0;
};


        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.flex1}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <ScrollView
              style={styles.flex1}
              contentContainerStyle={{ padding: 25, paddingBottom: 150 }}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.screenHeading}>Incident Report</Text>
              <Text style={styles.subText}>Create a formal record for a lost or found item.</Text>

              <View style={styles.formContainer}>
                <View style={styles.toggleRow}>
                  <TouchableOpacity style={[styles.toggleBtn, form.type === 'Found' && styles.toggleActive]} onPress={() => setForm({...form, type: 'Found'})}>
                    <Text style={[styles.toggleText, form.type === 'Found' && styles.toggleTextActive]}>Found Item</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.toggleBtn, form.type === 'Lost' && styles.toggleActive]} onPress={() => setForm({...form, type: 'Lost'})}>
                    <Text style={[styles.toggleText, form.type === 'Lost' && styles.toggleTextActive]}>Lost Item</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>FULL NAME</Text>
                  <TextInput style={[styles.inputField, errors.name && styles.inputError]} placeholder="Student / Staff Name" placeholderTextColor="#475569" value={form.name} onChangeText={t => setForm({...form, name: t})} />
                  {errors.name && <Text style={styles.errorLabel}>{errors.name}</Text>}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                  <TextInput style={[styles.inputField, errors.email && styles.inputError]} placeholder="name@university.edu" placeholderTextColor="#475569" autoCapitalize="none" keyboardType="email-address" value={form.email} onChangeText={t => setForm({...form, email: t})} />
                  {errors.email && <Text style={styles.errorLabel}>{errors.email}</Text>}
                </View>
                {/* --- Naya Code Yahan Se Shuru --- */}

{/* ITEM NAME Input */}
<View style={styles.inputGroup}>
  <Text style={styles.inputLabel}>ITEM NAME</Text>
  <TextInput
    style={styles.inputField}
    placeholder="e.g. MacBook Pro, Wallet"
    placeholderTextColor="#475569"
    value={form.item_name}
    onChangeText={t => setForm({...form, item_name: t})}
  />
</View>

{/* LOCATION Input */}
<View style={styles.inputGroup}>
  <Text style={styles.inputLabel}>LOCATION</Text>
  <TextInput
    style={styles.inputField}
    placeholder="e.g. Library, Block B"
    placeholderTextColor="#475569"
    value={form.location}
    onChangeText={t => setForm({...form, location: t})}
  />
</View>

{/* IMAGE PICKER BUTTON */}
<TouchableOpacity
  style={[styles.btnSubmit, { backgroundColor: '#1e293b', marginBottom: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 }]}
  onPress={pickImage}
>
  <Ionicons name="camera" size={20} color="#fff" />
  <Text style={[styles.btnSubmitText, { color: '#fff' }]}>
    {form.image_url ? "IMAGE SELECTED âœ…" : "UPLOAD IMAGE"}
  </Text>
</TouchableOpacity>

{/* --- Naya Code Yahan Khatam --- */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>ITEM DESCRIPTION</Text>
                  <TextInput style={[styles.inputField, styles.textArea, errors.msg && styles.inputError]} placeholder="Color, brand, unique markings..." placeholderTextColor="#475569" multiline numberOfLines={4} value={form.msg} onChangeText={t => setForm({...form, msg: t})} />
                  {errors.msg && <Text style={styles.errorLabel}>{errors.msg}</Text>}
                </View>

                <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit}>
                  <Text style={styles.btnSubmitText}>INITIALIZE REPORT</Text>
                  <Send size={18} color="#000" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        );
    };
