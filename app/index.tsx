import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import { THEME } from "../src/constants/theme";
import HeaderNav from "../src/components/landing/HeaderNav";
import DrawerMenu from "../src/components/navigation/DrawerMenu";
import HeroSection from "../src/components/landing/HeroSection";
import ProblemSection from "../src/components/landing/ProblemSection";
import HowItWorksSection from "../src/components/landing/HowItWorksSection";
import MatchDemoSection from "../src/components/landing/MatchDemoSection";
import FeaturesSection from "../src/components/landing/FeaturesSection";
import AudienceSection from "../src/components/landing/AudienceSection";
import CompareSection from "../src/components/landing/CompareSection";
import NumbersSection from "../src/components/landing/NumbersSection";
import FaqSection from "../src/components/landing/FaqSection";
import CtaSection from "../src/components/landing/CtaSection";
import FooterSection from "../src/components/landing/FooterSection";

export default function HomeScreen() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const scrollRef = useRef<any>(null);
  const sectionPositions = useRef<Record<string, number>>({});

  const handleLayout = (sectionId: string, event: LayoutChangeEvent) => {
    sectionPositions.current[sectionId] = event.nativeEvent.layout.y;
  };

  const handleScrollToSection = (sectionId: string) => {
    const y = sectionPositions.current[sectionId];
    if (y !== undefined && scrollRef.current) {
      scrollRef.current.scrollTo({ y: Math.max(0, y - 10), animated: true });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Sticky Header with Status Bar Inset Protection */}
      <HeaderNav
        onMenuPress={() => setDrawerVisible(true)}
        onLoginPress={() => router.push("/login")}
        onRegisterPress={() => router.push("/register")}
      />

      {/* Main Landing Scroll Content */}
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Hero */}
        <View onLayout={(e) => handleLayout("hero", e)}>
          <HeroSection
            onSearch={(query) => {
              handleScrollToSection("demo");
            }}
          />
        </View>

        {/* 2. Problem */}
        <View onLayout={(e) => handleLayout("problem", e)}>
          <ProblemSection />
        </View>

        {/* 3. How It Works */}
        <View onLayout={(e) => handleLayout("how-it-works", e)}>
          <HowItWorksSection />
        </View>

        {/* 4. Smart Match Demo */}
        <View onLayout={(e) => handleLayout("demo", e)}>
          <MatchDemoSection />
        </View>

        {/* 5. Features Grid */}
        <View onLayout={(e) => handleLayout("features", e)}>
          <FeaturesSection />
        </View>

        {/* 6. Audience Personas */}
        <View onLayout={(e) => handleLayout("audience", e)}>
          <AudienceSection />
        </View>

        {/* 7. Comparison Table */}
        <View onLayout={(e) => handleLayout("compare", e)}>
          <CompareSection />
        </View>

        {/* 8. Key Stats Strip */}
        <View onLayout={(e) => handleLayout("numbers", e)}>
          <NumbersSection />
        </View>

        {/* 9. FAQ Accordion */}
        <View onLayout={(e) => handleLayout("faq", e)}>
          <FaqSection />
        </View>

        {/* 10. Call To Action (Early Access) */}
        <View onLayout={(e) => handleLayout("cta", e)}>
          <CtaSection />
        </View>

        {/* 11. Footer */}
        <View onLayout={(e) => handleLayout("footer", e)}>
          <FooterSection onScrollToSection={handleScrollToSection} />
        </View>
      </ScrollView>

      {/* Slide-out Drawer Navigation */}
      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onScrollToSection={handleScrollToSection}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.canvasLight,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
