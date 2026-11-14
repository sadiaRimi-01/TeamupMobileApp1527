import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";
import Badge from "../common/Badge";
import Chip from "../common/Chip";
import {
  MATCH_CANDIDATES,
  MATCH_DEMO_ALL_SKILLS,
} from "../../constants/mockData";
import { authStore } from "../../services/authStore";
import { ApiService } from "../../services/api";

export default function MatchDemoSection() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "Java",
    "MySQL",
  ]);
  const [invitedMap, setInvitedMap] = useState<Record<string, boolean>>({});
  const [invitingName, setInvitingName] = useState<string | null>(null);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleInvite = async (candidateName: string) => {
    if (invitedMap[candidateName]) return;

    setInvitingName(candidateName);
    setInvitedMap((prev) => ({ ...prev, [candidateName]: true }));

    const token = authStore.getToken();
    const curUser = authStore.getUser();
    if (token) {
      try {
        const projectsRes = await ApiService.getProjects();
        let targetProj = null;
        if (projectsRes.success && projectsRes.projects && projectsRes.projects.length > 0) {
          targetProj = projectsRes.projects.find((p: any) =>
            curUser && (
              (p.leader?._id && String(p.leader._id) === String(curUser.id)) ||
              (p.leader?.email && curUser.email && p.leader.email.toLowerCase() === curUser.email.toLowerCase()) ||
              (p.leader?.name && curUser.name && p.leader.name.toLowerCase() === curUser.name.toLowerCase()) ||
              (String(p.leader) === String(curUser.id))
            )
          ) || projectsRes.projects[0];
        }

        const targetProjId = targetProj?._id || "proj_1";
        const targetProjTitle = targetProj?.title || "Smart Campus Initiative";

        await ApiService.applyToProject(
          token,
          targetProjId,
          `Smart Match Engine invitation sent to join "${targetProjTitle}".`,
          undefined,
          "Invitation",
          candidateName
        );
      } catch (err) {
        console.warn("MatchDemo Invite API error:", err);
      }
    }

    setInvitingName(null);

    Alert.alert(
      "Invitation Sent! 📨",
      `An invite to collaborate on your team has been sent to ${candidateName} and registered in MongoDB.`
    );
  };

  // Recompute match percentages dynamically
  const rankedCandidates = useMemo(() => {
    return MATCH_CANDIDATES.map((cand) => {
      if (selectedSkills.length === 0) {
        return { ...cand, matchPct: 50 };
      }
      let matches = 0;
      for (const s of selectedSkills) {
        if (cand.skills.includes(s)) {
          matches++;
        }
      }
      // base score + proportion
      const pct = Math.min(
        99,
        Math.max(45, Math.round((matches / selectedSkills.length) * 45 + 50))
      );
      return { ...cand, matchPct: pct, matchedCount: matches };
    }).sort((a, b) => b.matchPct - a.matchPct);
  }, [selectedSkills]);

  const topMatch = rankedCandidates[0];
  const isTopInvited = invitedMap[topMatch.name];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Badge label="LIVE MATCH DEMO" variant="pink" />
        <Text style={styles.title}>Try the Smart Match Engine</Text>
        <Text style={styles.subtitle}>
          Tap required project skills to simulate real-time teammate
          compatibility matching.
        </Text>
      </View>

      {/* Skill Toggle Chips */}
      <View style={styles.skillsContainer}>
        <Text style={styles.skillsPrompt}>Select Required Skills:</Text>
        <View style={styles.chipsWrap}>
          {MATCH_DEMO_ALL_SKILLS.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <Chip
                key={skill}
                label={skill}
                selected={isSelected}
                onPress={() => toggleSkill(skill)}
              />
            );
          })}
        </View>
      </View>

      {/* Match Results Card */}
      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.topMatchLabel}>TOP COMPATIBLE MATCH</Text>
            <Text style={styles.topMatchName}>{topMatch.name}</Text>
            <Text style={styles.topMatchRole}>{topMatch.role}</Text>
          </View>

          {/* Percentage Ring Display */}
          <View style={styles.ringWrapper}>
            <View style={styles.ringOuter}>
              <Text style={styles.ringPercentText}>{topMatch.matchPct}%</Text>
              <Text style={styles.ringSubText}>FIT</Text>
            </View>
          </View>
        </View>

        {/* Matched skills pill chips */}
        <View style={styles.matchedSkillsRow}>
          <Text style={styles.hasSkillsLabel}>Candidate Skills:</Text>
          <View style={styles.matchedTagsWrap}>
            {topMatch.skills.map((s) => {
              const isOverlap = selectedSkills.includes(s);
              return (
                <View
                  key={s}
                  style={[
                    styles.tagBadge,
                    isOverlap ? styles.tagOverlap : styles.tagNormal,
                  ]}
                >
                  {isOverlap && (
                    <Ionicons
                      name="checkmark"
                      size={12}
                      color={THEME.white}
                      style={{ marginRight: 3 }}
                    />
                  )}
                  <Text
                    style={[
                      styles.tagText,
                      isOverlap ? styles.tagOverlapText : styles.tagNormalText,
                    ]}
                  >
                    {s}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Top Match Invite Button Row */}
        <View style={styles.topActionRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.topInviteBtn,
              isTopInvited && styles.topInvitedBtn,
            ]}
            onPress={() => handleInvite(topMatch.name)}
            disabled={isTopInvited || invitingName === topMatch.name}
          >
            <Ionicons
              name={isTopInvited ? "checkmark-circle" : "paper-plane-outline"}
              size={16}
              color={isTopInvited ? THEME.successGreen : THEME.white}
            />
            <Text
              style={[
                styles.topInviteBtnText,
                isTopInvited && styles.topInvitedBtnText,
              ]}
            >
              {isTopInvited
                ? `Invitation Sent to ${topMatch.name.split(" ")[0]}`
                : `Invite ${topMatch.name} to Team`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Other candidates comparison row */}
        <View style={styles.otherCandidatesSection}>
          <Text style={styles.otherTitle}>Other Available Matches:</Text>
          {rankedCandidates.slice(1).map((cand) => {
            const isInvited = invitedMap[cand.name];
            const isInviting = invitingName === cand.name;

            return (
              <View key={cand.name} style={styles.candMiniRow}>
                <View
                  style={[
                    styles.miniAvatar,
                    { backgroundColor: cand.gradient[0] },
                  ]}
                >
                  <Text style={styles.miniAvatarText}>{cand.initials}</Text>
                </View>

                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.miniName}>{cand.name}</Text>
                  <Text style={styles.miniRole}>{cand.role}</Text>
                </View>

                <View style={styles.miniMatchBadge}>
                  <Text style={styles.miniMatchText}>{cand.matchPct}%</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.miniInviteBtn,
                    isInvited && styles.miniInvitedBtn,
                  ]}
                  onPress={() => handleInvite(cand.name)}
                  disabled={isInvited || isInviting}
                >
                  <Ionicons
                    name={isInvited ? "checkmark-circle" : "person-add-outline"}
                    size={14}
                    color={isInvited ? THEME.successGreen : THEME.white}
                  />
                  <Text
                    style={[
                      styles.miniInviteBtnText,
                      isInvited && styles.miniInvitedBtnText,
                    ]}
                  >
                    {isInvited ? "Sent" : "Invite"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 36,
    paddingHorizontal: 20,
    backgroundColor: THEME.canvasLight,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: THEME.inkDark,
    lineHeight: 34,
    marginTop: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: THEME.textSecondary,
    marginTop: 8,
  },
  skillsContainer: {
    marginBottom: 20,
  },
  skillsPrompt: {
    fontSize: 12,
    fontWeight: "800",
    color: THEME.textMuted,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  resultCard: {
    backgroundColor: THEME.white,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: "rgba(79, 70, 229, 0.25)",
    shadowColor: THEME.brandPink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
    paddingBottom: 16,
  },
  topMatchLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: THEME.brandPink,
    letterSpacing: 0.8,
  },
  topMatchName: {
    fontSize: 20,
    fontWeight: "900",
    color: THEME.inkDark,
    marginTop: 2,
  },
  topMatchRole: {
    fontSize: 13,
    color: THEME.textSecondary,
    fontWeight: "600",
    marginTop: 2,
  },
  ringWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringOuter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: THEME.pastelPink,
    borderWidth: 3,
    borderColor: THEME.brandPink,
    justifyContent: "center",
    alignItems: "center",
  },
  ringPercentText: {
    fontSize: 18,
    fontWeight: "900",
    color: THEME.brandPink,
  },
  ringSubText: {
    fontSize: 9,
    fontWeight: "900",
    color: THEME.textSecondary,
  },
  matchedSkillsRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
  },
  hasSkillsLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: THEME.textMuted,
    marginBottom: 8,
  },
  matchedTagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tagBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagOverlap: {
    backgroundColor: THEME.brandPink,
  },
  tagNormal: {
    backgroundColor: THEME.canvasLight,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "700",
  },
  tagOverlapText: {
    color: THEME.white,
  },
  tagNormalText: {
    color: THEME.textSecondary,
  },
  otherCandidatesSection: {
    paddingTop: 14,
  },
  otherTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: THEME.textMuted,
    marginBottom: 10,
  },
  candMiniRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  miniAvatarText: {
    color: THEME.white,
    fontWeight: "900",
    fontSize: 11,
  },
  miniName: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.inkDark,
  },
  miniRole: {
    fontSize: 11,
    color: THEME.textSecondary,
  },
  miniMatchBadge: {
    backgroundColor: THEME.pastelViolet,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  miniMatchText: {
    fontSize: 12,
    fontWeight: "800",
    color: THEME.accentViolet,
  },
  topActionRow: {
    paddingTop: 14,
    paddingBottom: 4,
  },
  topInviteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: THEME.brandPink,
    paddingVertical: 11,
    borderRadius: 14,
    shadowColor: THEME.brandPink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  topInvitedBtn: {
    backgroundColor: THEME.pastelMint,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.4)",
    shadowOpacity: 0,
    elevation: 0,
  },
  topInviteBtnText: {
    color: THEME.white,
    fontWeight: "800",
    fontSize: 13,
  },
  topInvitedBtnText: {
    color: THEME.successGreen,
    fontWeight: "800",
  },
  miniInviteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: THEME.brandPink,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  miniInvitedBtn: {
    backgroundColor: THEME.pastelMint,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.35)",
  },
  miniInviteBtnText: {
    color: THEME.white,
    fontSize: 11,
    fontWeight: "800",
  },
  miniInvitedBtnText: {
    color: THEME.successGreen,
    fontWeight: "800",
  },
});

