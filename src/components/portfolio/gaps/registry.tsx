import React from 'react';
import { GapSectionConfig } from './types';

export const GAP_SECTIONS: GapSectionConfig[] = [
  { key: 'productProfile', label: 'Product Profile', icon: '🚀', description: 'Delivery model, maturity stage, use cases, capabilities', required: false, showWhen: item => item.catalogType === 'product' },
  { key: 'clientIntake', label: 'Client Intake', icon: '📋', description: 'Problem statement, objectives, stakeholder quotes', required: false, showWhen: item => item.catalogType === 'case-study' },
  { key: 'testimonials', label: 'Testimonials', icon: '💬', description: 'Client testimonials & social proof', required: false },
  { key: 'transformation', label: 'Transformation', icon: '🔄', description: 'Before/after evidence & metrics', required: false, showWhen: item => item.catalogType === 'case-study' },
  { key: 'deliveryMetadata', label: 'Delivery', icon: '📦', description: 'Budget, timeline, team size, engagement model', required: false, showWhen: item => item.catalogType === 'case-study' },
  { key: 'methodologyWalkthrough', label: 'Methodology', icon: '🗺️', description: 'Phase-by-phase walkthrough', required: false },
  { key: 'approvalWorkflow', label: 'Approval', icon: '✅', description: 'NDA status, sign-offs, asset clearance', required: false, showWhen: item => item.catalogType === 'case-study' },
  { key: 'performanceData', label: 'Performance', icon: '📊', description: 'Lighthouse, Core Web Vitals, analytics', required: false },
  { key: 'competitiveContext', label: 'Competitive', icon: '⚔️', description: 'Alternatives evaluated, differentiators', required: false, showWhen: item => item.catalogType === 'case-study' },
  { key: 'containerConfig', label: 'Containers', icon: '🐳', description: 'Docker images, K8s manifests, Helm charts', required: false },
  { key: 'postLaunchTracking', label: 'Post-Launch', icon: '📈', description: 'ROI snapshots, NPS, renewal status', required: false, showWhen: item => item.catalogType === 'case-study' },
  { key: 'suggestedTemplate', label: 'Template', icon: '📝', description: 'Case study template & format engine', required: false, showWhen: item => item.catalogType === 'case-study' },
  { key: 'exportConfigs', label: 'Exports', icon: '📤', description: 'NotebookLM, cinematic, PDF, CMS exports', required: false },
];
