import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { insertGlucoseTarget, insertCarbRatio, insertDexComLogin, exportTableAsCSV } from "@/reuseableFunctions/dbInit";
const { width: screenWidth } = Dimensions.get('window');

export default function About() {
  const [selectedTab, setSelectedTab] = useState('Learn More');

  const renderContent = () => {
    switch (selectedTab) {
      case 'Learn More':
        return (
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>
              Click on the tab headers to learn more about target glucose levels, how CarbCapture stores your data, and set your personalized target ratio to start using the app!
            </Text>
          </View>
        );
      case 'Security':
        return (
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>
              At CarbCapture, your privacy is our priority. The data you enter stays safely on your phone and is never stored on any server or external applications. Only <Text style={styles.bold}>you</Text> have access to your information, and you can log out at any time for added security. Rest assured, no one else can see your data—it’s just for you to help manage your health confidently.
            </Text>
          </View>
        );
      case 'Set Target':
        return (
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>
              A typical target blood glucose range is between 80 and 140 mg/dL to help keep you healthy and balanced. Your doctor can provide your specific target number based on your individual health needs—be sure to use that for best results!
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Tabs Header */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Learn More' && styles.activeTab]}
          onPress={() => setSelectedTab('Learn More')}
        >
          <Text style={[styles.tabText, selectedTab === 'Learn More' && styles.activeTabText]}>
            Learn More
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Security' && styles.activeTab]}
          onPress={() => setSelectedTab('Security')}
        >
          <Text style={[styles.tabText, selectedTab === 'Security' && styles.activeTabText]}>
            Security
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Set Target' && styles.activeTab]}
          onPress={() => setSelectedTab('Set Target')}
        >
          <Text style={[styles.tabText, selectedTab === 'Set Target' && styles.activeTabText]}>
            Set Target
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#e6e6e6',
    marginHorizontal: 5,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#333',
  },
  tabText: {
    fontSize: 14,
    color: '#333',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  contentBox: {
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
