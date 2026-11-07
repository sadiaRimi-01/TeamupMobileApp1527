import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { THEME } from "../../constants/theme";
import Badge from "../common/Badge";
import Button from "../common/Button";
import Chip from "../common/Chip";
import {
  HERO_MEMBERS,
  POPULAR_SKILLS,
  MARQUEE_ITEMS,
} from "../../constants/mockData";
import { TeamMember } from "../../types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string>("Java");
  const [invitedMembers, setInvitedMembers] = useState<Record<string, boolean>>({});

  const handleSearchSubmit = () => {
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      router.push({
        pathname: "/teams",
        params: { skill: searchQuery || selectedSkill },
      } as any);
    }
  };

  const handleSkillPress = (skill: string) => {
    const next = selectedSkill === skill ? "" : skill;
    setSelectedSkill(next);
    if (next) {
      setSearchQuery(next);
    }
  };

  const toggleInvite = (id: string) => {
    setInvitedMembers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View style={styles.container}>
      {/* 1. Eyebrow Badge */}
      <View style={styles.eyebrowWrapper}>
        <Badge
          label="Skill-based team formation"
          variant="outline"
          showRadar={true}
        />
      </View>

      {/* 2. Headline */}
      <View style={styles.headlineWrapper}>
        <Text style={styles.headline}>
          Find the right{"\n"}
          <Text style={styles.pinkHighlight}>teammates.</Text>
        </Text>
        {/* Pink Squiggle underline bar */}
        <View style={styles.squiggleBar} />
        <Text style={styles.headlineSub}>Build what matters.</Text>
      </View>

      {/* 3. Subtext */}
      <Text style={styles.subtext}>
        TeamUp matches students, developers, freelancers and researchers by
        skill, so you spend less time searching and more time building.
      </Text>

      {/* 4. Hero Search Pill */}
      <View style={styles.searchPill}>
        <Ionicons
          name="search-outline"
          size={20}
          color={THEME.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by skill: Java, UI/UX, Python..."
          placeholderTextColor={THEME.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.searchButton}
          onPress={handleSearchSubmit}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* 5. Popular jumping skill pills */}
      <View style={styles.popularRow}>
        <Text style={styles.popularLabel}>Popular:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.skillsScroll}
        >
          {POPULAR_SKILLS.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              size="sm"
              selected={selectedSkill === skill}
              onPress={() => handleSkillPress(skill)}
            />
          ))}
        </ScrollView>
      </View>

      {/* 6. Primary Action Buttons */}
      <View style={styles.actionButtonsRow}>
        <View style={{ flex: 1 }}>
          <Button
            title="Find Teammates"
            iconName="sparkles"
            variant="primary"
            size="md"
            onPress={() => router.push("/teams")}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title="Post a Project"
            iconName="add-circle-outline"
            variant="secondary"
            size="md"
            onPress={() => router.push("/projects")}
          />
        </View>
      </View>

      {/* 7. Member Showcase Cards Carousel */}
      <View style={styles.showcaseSection}>
        <View style={styles.showcaseHeader}>
          <Text style={styles.showcaseTitle}>Top Matched Candidates</Text>
          <TouchableOpacity onPress={() => router.push("/teams")}>
            <Text style={styles.seeAllText}>View All →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsScroll}
          decelerationRate="fast"
          snapToInterval={SCREEN_WIDTH * 0.78 + 14}
        >
          {HERO_MEMBERS.map((member: TeamMember) => {
            const isInvited = invitedMembers[member.id];

            return (
              <View key={member.id} style={styles.memberCard}>
                {/* Card Header gradient banner */}
                <View
                  style={[
                    styles.cardHeaderBanner,
                    { backgroundColor: member.gradient[0] },
                  ]}
                >
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchBadgeText}>
                      {member.matchPct}% Match
                    </Text>
                  </View>

                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.ratingText}>{member.rating}</Text>
                  </View>
                </View>

                {/* Avatar */}
                <View style={styles.avatarRow}>
                  <View
                    style={[
                      styles.avatarCircle,
                      { backgroundColor: member.gradient[1] },
                    ]}
                  >
                    <Text style={styles.avatarInitials}>
                      {member.initials}
                    </Text>
                  </View>

                  {member.university && (
                    <View style={styles.uniBadge}>
                      <Ionicons
                        name="school-outline"
                        size={12}
                        color={THEME.textSecondary}
                      />
                      <Text style={styles.uniText}>{member.university}</Text>
                    </View>
                  )}
                </View>

                {/* Member Info */}
                <View style={styles.memberBody}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole} numberOfLines={1}>
                    {member.role}
                  </Text>
                  <Text style={styles.memberBio} numberOfLines={2}>
                    {member.bio}
                  </Text>

                  {/* Skills tags */}
                  <View style={styles.skillsTagWrap}>
                    {member.skills.slice(0, 3).map((s) => (
                      <View key={s} style={styles.smallSkillPill}>
                        <Text style={styles.smallSkillText}>{s}</Text>
                      </View>
                    ))}
                    {member.skills.length > 3 && (
                      <View style={styles.smallSkillPill}>
                        <Text style={styles.smallSkillText}>
                          +{member.skills.length - 3}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Card Action */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.inviteButton,
                      isInvited && styles.invitedButton,
                    ]}
                    onPress={() => toggleInvite(member.id)}
                  >
                    <Ionicons
                      name={isInvited ? "checkmark-circle" : "paper-plane-outline"}
                      size={15}
                      color={isInvited ? THEME.successGreen : THEME.brandPink}
                    />
                    <Text
                      style={[
                        styles.inviteButtonText,
                        isInvited && styles.invitedButtonText,
                      ]}
                    >
                      {isInvited ? "Invitation Sent" : "Invite to Team"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* 8. Marquee Strip */}
      <View style={styles.marqueeStrip}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.marqueeScroll}
        >
          {MARQUEE_ITEMS.map((item, index) => (
            <View key={index} style={styles.marqueePill}>
              <Text style={styles.marqueeText}>{item}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 28,
    paddingBottom: 20,
    backgroundColor: THEME.canvasLight,
  },
  eyebrowWrapper: {
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  headlineWrapper: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headline: {
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 42,
    textAlign: "center",
    color: THEME.inkDark,
    letterSpacing: -0.8,
  },
  pinkHighlight: {
    color: THEME.brandPink,
  },
  squiggleBar: {
    width: 140,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.brandPink,
    marginTop: 4,
    marginBottom: 6,
  },
  headlineSub: {
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 38,
    textAlign: "center",
    color: THEME.inkDark,
    letterSpacing: -0.6,
  },
  subtext: {
    paddingHorizontal: 24,
    fontSize: 15,
    lineHeight: 23,
    color: THEME.textSecondary,
    textAlign: "center",
    marginTop: 14,
    marginBottom: 24,
  },
  searchPill: {
    marginHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.white,
    borderRadius: 50,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1.2,
    borderColor: THEME.cardBorder,
    shadowColor: THEME.inkDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 14,
    color: THEME.inkDark,
    fontWeight: "600",
  },
  searchButton: {
    backgroundColor: THEME.brandPink,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    shadowColor: THEME.brandPink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  searchButtonText: {
    color: THEME.white,
    fontWeight: "800",
    fontSize: 13,
  },
  popularRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 18,
  },
  popularLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: THEME.textMuted,
    marginRight: 8,
  },
  skillsScroll: {
    gap: 8,
    paddingRight: 16,
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 18,
    marginTop: 22,
    marginBottom: 28,
  },
  showcaseSection: {
    marginTop: 6,
  },
  showcaseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  showcaseTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: THEME.inkDark,
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.brandPink,
  },
  cardsScroll: {
    paddingLeft: 20,
    paddingRight: 10,
    gap: 14,
  },
  memberCard: {
    width: SCREEN_WIDTH * 0.76,
    backgroundColor: THEME.white,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    shadowColor: THEME.inkDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 8,
  },
  cardHeaderBanner: {
    height: 70,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  matchBadge: {
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  matchBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    color: THEME.brandPink,
  },
  ratingBadge: {
    backgroundColor: "rgba(13, 12, 34, 0.75)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ratingText: {
    color: THEME.white,
    fontSize: 11,
    fontWeight: "800",
  },
  avatarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: -24,
    paddingHorizontal: 16,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: THEME.white,
    shadowColor: THEME.inkDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarInitials: {
    color: THEME.white,
    fontWeight: "900",
    fontSize: 16,
  },
  uniBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: THEME.canvasLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  uniText: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.textSecondary,
  },
  memberBody: {
    padding: 16,
    paddingTop: 10,
  },
  memberName: {
    fontSize: 17,
    fontWeight: "900",
    color: THEME.inkDark,
  },
  memberRole: {
    fontSize: 13,
    color: THEME.textSecondary,
    fontWeight: "600",
    marginTop: 2,
    marginBottom: 6,
  },
  memberBio: {
    fontSize: 12,
    color: THEME.textMuted,
    lineHeight: 17,
    marginBottom: 12,
  },
  skillsTagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 14,
  },
  smallSkillPill: {
    backgroundColor: THEME.pastelViolet,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  smallSkillText: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.accentViolet,
  },
  inviteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: THEME.pastelPink,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.2)",
  },
  invitedButton: {
    backgroundColor: THEME.pastelMint,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  inviteButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.brandPink,
  },
  invitedButtonText: {
    color: THEME.successGreen,
  },
  marqueeStrip: {
    marginTop: 24,
    paddingVertical: 12,
    backgroundColor: THEME.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: THEME.cardBorder,
  },
  marqueeScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  marqueePill: {
    backgroundColor: THEME.canvasLight,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.cardBorderSubtle,
  },
  marqueeText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.textSecondary,
  },
});

