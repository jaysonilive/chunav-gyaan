import { initializeApp } from "firebase/app";
import { 
  getAnalytics, 
  logEvent,
  setUserId,
  setUserProperties 
} from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

let analytics = null;
try {
  analytics = getAnalytics(app);
  
  // Generate anonymous user ID on first visit
  const userId = localStorage.getItem('chunav_uid') || Math.random().toString(36).substr(2,9);
  localStorage.setItem('chunav_uid', userId);
  setUserId(analytics, userId);

  // Set user properties
  setUserProperties(analytics, {
    app_language: 'English',
    app_version: '2.0',
    platform: 'web'
  });
} catch (e) {
  console.log("Analytics not available");
}

export const trackEvent = (eventName, params = {}) => {
  try {
    if (analytics) logEvent(analytics, eventName, params);
  } catch (e) {
    console.log("Track event failed:", eventName);
  }
};

export const trackPageView = (pageName) =>
  trackEvent('page_view', { 
    page_title: pageName,
    page_location: window.location.href 
  });

export const trackQuizEvent = (action, data) =>
  trackEvent(`quiz_${action}`, data);

export const trackCivicLearning = (topic, action) =>
  trackEvent('civic_learning', { 
    topic, action 
  });

export const trackAIChat = (question, answer) =>
  trackEvent('ai_chat', {
    question_length: question?.length || 0,
    answer_length: answer?.length || 0,
    timestamp: Date.now()
  });

export const trackSearch = (query, results) =>
  trackEvent('search', {
    search_term: query,
    results_count: results
  });

export const trackChartViewed = (chartName) =>
  trackEvent('chart_viewed', {
    chart_name: chartName
  });

export const trackTimelineEngagement = (nodeName, phase) =>
  trackEvent('timeline_engagement', {
    node_name: nodeName,
    phase: phase
  });

export default app;
