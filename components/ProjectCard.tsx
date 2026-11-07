import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../constants/colors";

type ProjectCardProps = {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  members: string;
  skills: string[];
  onPress?: () => void;
};

export default function ProjectCard({
  title,
  description,
  category,
  difficulty,
  members,
  skills,
  onPress,
}: ProjectCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {/* Top Row */}
      <View style={styles.topRow}>
        <View style={styles.categoryContainer}>
          <Ionicons
            name="folder-outline"
            size={16}
            color={COLORS.primary}
          />

          <Text style={styles.category}>
            {category}
          </Text>
        </View>

        <View style={styles.difficultyContainer}>
          <Text style={styles.difficulty}>
            {difficulty}
          </Text>
        </View>
      </View>

      {/* Project Title */}
      <Text style={styles.title}>
        {title}
      </Text>

      {/* Description */}
      <Text
        style={styles.description}
        numberOfLines={3}
      >
        {description}
      </Text>

      {/* Skills */}
      <View style={styles.skillsContainer}>
        {skills.map((skill) => (
          <View
            key={skill}
            style={styles.skill}
          >
            <Text style={styles.skillText}>
              {skill}
            </Text>
          </View>
        ))}
      </View>

      {/* Bottom */}
      <View style={styles.bottomRow}>
        <View style={styles.members}>
          <Ionicons
            name="people-outline"
            size={18}
            color={COLORS.textSecondary}
          />

          <Text style={styles.membersText}>
            {members}
          </Text>
        </View>

        <View style={styles.viewProject}>
          <Text style={styles.viewText}>
            View Project
          </Text>

          <Ionicons
            name="arrow-forward"
            size={17}
            color={COLORS.primary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 15,

    padding: 18,

    marginBottom: 15,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,

    elevation: 2,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  category: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },

  difficultyContainer: {
    backgroundColor: "#EFF6FF",

    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 7,
  },

  difficulty: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
  },

  title: {
    color: COLORS.text,

    fontSize: 19,
    fontWeight: "900",

    marginTop: 14,
  },

  description: {
    color: COLORS.textSecondary,

    fontSize: 13,
    lineHeight: 20,

    marginTop: 8,
  },

  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",

    gap: 7,

    marginTop: 15,
  },

  skill: {
    backgroundColor: COLORS.background,

    borderWidth: 1,
    borderColor: COLORS.border,

    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 6,
  },

  skillText: {
    color: COLORS.textSecondary,

    fontSize: 11,
    fontWeight: "600",
  },

  bottomRow: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",

    marginTop: 18,

    paddingTop: 15,

    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  members: {
    flexDirection: "row",
    alignItems: "center",

    gap: 6,
  },

  membersText: {
    color: COLORS.textSecondary,

    fontSize: 12,
    fontWeight: "600",
  },

  viewProject: {
    flexDirection: "row",
    alignItems: "center",

    gap: 5,
  },

  viewText: {
    color: COLORS.primary,

    fontSize: 12,
    fontWeight: "800",
  },
});