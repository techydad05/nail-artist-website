import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Admin user store
export const adminUser = writable(null);

// Loading states
export const isLoading = writable(false);

// Admin authentication functions
export const adminAuth = {
  async login(email, password) {
    isLoading.set(true);
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'login',
          email,
          password
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        adminUser.set(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      isLoading.set(false);
    }
  },
  
  async logout() {
    try {
      await fetch('/api/admin/auth', {
        method: 'DELETE'
      });
      
      adminUser.set(null);
      
      if (browser) {
        window.location.href = '/admin/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  
  async checkSession() {
    try {
      const response = await fetch('/api/admin/auth');
      const data = await response.json();
      
      if (data.success && data.user) {
        adminUser.set(data.user);
        return data.user;
      } else {
        adminUser.set(null);
        return null;
      }
    } catch (error) {
      console.error('Session check error:', error);
      adminUser.set(null);
      return null;
    }
  }
};

// Content management functions
export const contentManager = {
  async getPages() {
    try {
      const response = await fetch('/api/admin/content');
      const data = await response.json();
      
      if (data.success) {
        return data.pages;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }
  },
  
  async getPage(slug) {
    try {
      const response = await fetch(`/api/admin/content?page=${slug}`);
      const data = await response.json();
      
      if (data.success) {
        return { page: data.page, sections: data.sections };
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      throw error;
    }
  },
  
  async createPage(pageData) {
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create_page',
          ...pageData
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.page;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  },
  
  async updatePage(id, pageData) {
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'update_page',
          id,
          ...pageData
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.page;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error updating page:', error);
      throw error;
    }
  },
  
  async createSection(sectionData) {
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create_section',
          ...sectionData
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.section;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error creating section:', error);
      throw error;
    }
  },
  
  async updateSection(id, sectionData) {
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'update_section',
          id,
          ...sectionData
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.section;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error updating section:', error);
      throw error;
    }
  }
};