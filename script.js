class NetBramhaDashboard {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    this.sidebarOpen = false;
    this.init();
  }

  init() {
    this.setupEventListeners();

    setTimeout(() => {
      this.animateGauge();
      this.animateCharts();
    }, 300);
    this.setupAccountFilters();
    this.setupInteractiveElements();
    this.setupResponsiveFeatures();
  }

  setupEventListeners() {
    const sidebarToggle = document.getElementById("sidebarToggle");
    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", () => this.toggleSidebar());
    }

    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleAccountFilter(e));
    });

    const scoreGauge = document.querySelector(".score-gauge");
    if (scoreGauge) {
      scoreGauge.addEventListener("mouseenter", () => this.highlightGauge());
      scoreGauge.addEventListener("mouseleave", () => this.unhighlightGauge());
      scoreGauge.addEventListener("click", () => this.showScoreDetails());
    }

    const refreshBtn = document.getElementById("refreshBtn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", (e) => this.handleRefresh(e));
    }

    const scoreAnalysisBtn = document.getElementById("scoreAnalysisBtn");
    if (scoreAnalysisBtn) {
      scoreAnalysisBtn.addEventListener("click", () =>
        this.showScoreAnalysis()
      );
    }

    this.setupNavigation();

    const navItems = document.querySelectorAll(".sidebar .nav-item");
    navItems.forEach((item) => {
      item.addEventListener("click", (e) => this.handleSidebarNavigation(e));
    });

    const reportLinks = document.querySelectorAll(".report-link");
    reportLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleReportLink(link.textContent.trim());
      });
    });

    const readMoreLink = document.querySelector(".read-more");
    if (readMoreLink) {
      readMoreLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.showDisputesInfo();
      });
    }

    document.addEventListener("click", (e) => {
      if (
        this.isMobile &&
        this.sidebarOpen &&
        !e.target.closest(".sidebar") &&
        !e.target.closest(".sidebar-toggle")
      ) {
        this.toggleSidebar();
      }
    });

    window.addEventListener("resize", () => this.handleResize());
  }

  toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    this.sidebarOpen = !this.sidebarOpen;

    if (this.sidebarOpen) {
      sidebar.classList.add("open");
    } else {
      sidebar.classList.remove("open");
    }
  }

  handleSidebarNavigation(event) {
    const item = event.target.closest(".nav-item");
    if (!item) return;

    document.querySelectorAll(".sidebar .nav-item").forEach((navItem) => {
      navItem.classList.remove("active");
    });

    item.classList.add("active");

    const section = item.dataset.section;
    this.navigateToSection(section);

    if (this.isMobile) {
      setTimeout(() => this.toggleSidebar(), 300);
    }
  }

  navigateToSection(section) {
    // Scroll to appropriate section
    const sectionMap = {
      overview: ".dashboard-container",
      report: ".report-section",
      alerts: ".disputes-section",
      simulator: ".where-you-stand-section",
      education: ".score-history-section",
      upgrade: ".accounts-section",
      rewards: ".footer",
    };

    const targetElement = document.querySelector(
      sectionMap[section] || ".dashboard-container"
    );
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    this.showSuccessMessage(
      `Navigated to ${section.charAt(0).toUpperCase() + section.slice(1)}`
    );
  }

  setupNavigation() {
    const navItems = document.querySelectorAll(".header .nav-item");
    navItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const text = item.querySelector("span:last-child")?.textContent;
        if (text) {
          this.handleNavigation(text, e);
        }
      });
    });
  }

  handleNavigation(action, event) {
    event.preventDefault();

    switch (action.toLowerCase()) {
      case "how it works":
        this.showModal(
          "How It Works",
          "Learn about how NetBramha calculates your credit score and provides personalized recommendations to improve your financial health."
        );
        break;
      case "english":
        this.showLanguageSelector();
        break;
      case "my account":
        this.showAccountMenu();
        break;
      case "logout":
        this.handleLogout();
        break;
    }
  }

  animateGauge() {
    const needle = document.getElementById("gaugeNeedle");
    const score = 767;
    const maxScore = 900;
    const minScore = 300;

    const percentage = (score - minScore) / (maxScore - minScore);
    const rotation = percentage * 180 - 90;

    if (needle) {
      let currentRotation = -90;
      const targetRotation = rotation;
      const animationDuration = 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);

        // Smooth easing function
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);

        currentRotation = -90 + (targetRotation + 90) * easeOutCubic;
        needle.setAttribute("transform", `rotate(${currentRotation} 150 140)`);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      setTimeout(() => requestAnimationFrame(animate), 500);
    }
  }

  animateCharts() {
    const segments = document.querySelectorAll(".chart-segment");
    segments.forEach((segment, index) => {
      const originalDashArray = segment.getAttribute("stroke-dasharray");
      segment.setAttribute("stroke-dasharray", "0 440");

      setTimeout(() => {
        segment.style.transition = "stroke-dasharray 1.5s ease-in-out";
        segment.setAttribute("stroke-dasharray", originalDashArray);
      }, index * 400 + 800);
    });

    const barSegments = document.querySelectorAll(".bar-segment");
    barSegments.forEach((segment, index) => {
      segment.style.transform = "scaleX(0)";
      segment.style.transformOrigin = "left center";
      setTimeout(() => {
        segment.style.transition = "transform 0.8s ease-out";
        segment.style.transform = "scaleX(1)";
      }, index * 150 + 1500);
    });
  }

  setupAccountFilters() {
    this.accountData = {
      all: [
        { type: "Closed credit cards", count: 4, color: "#8B5CF6" },
        { type: "Closed loans", count: 1, color: "#8B5CF6" },
        { type: "Open credit cards", count: 2, color: "#06B6D4" },
        { type: "Open loans", count: 6, color: "#EAB308" },
      ],
      open: [
        { type: "Open credit cards", count: 2, color: "#06B6D4" },
        { type: "Open loans", count: 6, color: "#EAB308" },
      ],
      closed: [
        { type: "Closed credit cards", count: 4, color: "#8B5CF6" },
        { type: "Closed loans", count: 1, color: "#8B5CF6" },
      ],
    };
  }

  handleAccountFilter(event) {
    const button = event.target;
    const filter = button.dataset.filter;

    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
      btn.style.transform = "scale(1)";
    });

    button.classList.add("active");

    this.updateAccountsDisplay(filter);

    button.style.transform = "scale(0.95)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
    }, 150);

    this.showSuccessMessage(
      `Filtering: ${filter.charAt(0).toUpperCase() + filter.slice(1)} accounts`
    );
  }

  updateAccountsDisplay(filter) {
    const data = this.accountData[filter];
    const totalAccounts = data.reduce((sum, item) => sum + item.count, 0);

    const totalElement = document.getElementById("totalAccounts");
    if (totalElement) {
      this.animateNumber(
        totalElement,
        parseInt(totalElement.textContent),
        totalAccounts
      );
    }

    const accountsLegend = document.getElementById("accountsLegend");
    if (accountsLegend) {
      const currentItems = accountsLegend.querySelectorAll(".account-item");
      currentItems.forEach((item, index) => {
        setTimeout(() => {
          item.style.transition = "all 0.2s ease-out";
          item.style.opacity = "0";
          item.style.transform = "translateX(-20px)";
        }, index * 50);
      });

      setTimeout(() => {
        accountsLegend.innerHTML = "";
        data.forEach((item, index) => {
          setTimeout(() => {
            const accountItem = this.createAccountItem(item);
            accountsLegend.appendChild(accountItem);
          }, index * 100);
        });
      }, currentItems.length * 50 + 100);
    }

    this.updateDonutChart(data);
  }

  createAccountItem(item) {
    const div = document.createElement("div");
    div.className = "account-item";
    div.innerHTML = `
            <div class="account-indicator" style="background-color: ${item.color};"></div>
            <span class="account-type">${item.type}</span>
            <span class="account-count">${item.count}</span>
        `;

    div.style.opacity = "0";
    div.style.transform = "translateX(-20px)";

    setTimeout(() => {
      div.style.transition = "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
      div.style.opacity = "1";
      div.style.transform = "translateX(0)";
    }, 50);

    return div;
  }

  updateDonutChart(data) {
    const segments = document.querySelectorAll(".chart-segment");
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const circumference = 2 * Math.PI * 70;

    let currentOffset = 0;

    segments.forEach((segment, index) => {
      if (index < data.length) {
        const percentage = data[index].count / total;
        const strokeDasharray = percentage * circumference;

        segment.style.transition = "all 1s ease-in-out";
        segment.setAttribute(
          "stroke-dasharray",
          `${strokeDasharray} ${circumference}`
        );
        segment.setAttribute("stroke-dashoffset", `-${currentOffset}`);
        segment.style.opacity = "1";

        currentOffset += strokeDasharray;
      } else {
        segment.style.opacity = "0";
      }
    });
  }

  animateNumber(element, from, to) {
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * easedProgress);

      element.textContent = current;

      const scale = 1 + Math.sin(progress * Math.PI) * 0.05;
      element.style.transform = `scale(${scale})`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.style.transform = "scale(1)";
      }
    };

    requestAnimationFrame(animate);
  }

  highlightGauge() {
    const gauge = document.querySelector(".score-gauge");
    const needle = document.getElementById("gaugeNeedle");

    if (gauge) {
      gauge.style.transform = "scale(1.02)";
      gauge.style.transition = "transform 0.3s ease-out";
      gauge.style.filter = "drop-shadow(0 4px 12px rgba(14, 165, 233, 0.3))";
    }

    if (needle) {
      needle.style.stroke = "#0EA5E9";
      needle.style.strokeWidth = "4";
      needle.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.3))";
    }
  }

  unhighlightGauge() {
    const gauge = document.querySelector(".score-gauge");
    const needle = document.getElementById("gaugeNeedle");

    if (gauge) {
      gauge.style.transform = "scale(1)";
      gauge.style.filter = "none";
    }

    if (needle) {
      needle.style.stroke = "#1F2937";
      needle.style.strokeWidth = "3";
      needle.style.filter = "none";
    }
  }

  showScoreDetails() {
    const modalContent = `
            <div class="score-details">
                <div class="score-header">
                    <div class="score-large">767</div>
                    <div class="score-status good">Good Credit Score</div>
                </div>
                <div class="score-breakdown">
                    <div class="breakdown-item">
                        <span class="breakdown-label">Payment History</span>
                        <div class="breakdown-bar">
                            <div class="breakdown-fill" style="width: 85%"></div>
                        </div>
                        <span class="breakdown-score">85%</span>
                    </div>
                    <div class="breakdown-item">
                        <span class="breakdown-label">Credit Utilization</span>
                        <div class="breakdown-bar">
                            <div class="breakdown-fill" style="width: 78%"></div>
                        </div>
                        <span class="breakdown-score">78%</span>
                    </div>
                    <div class="breakdown-item">
                        <span class="breakdown-label">Credit Mix</span>
                        <div class="breakdown-bar">
                            <div class="breakdown-fill" style="width: 82%"></div>
                        </div>
                        <span class="breakdown-score">82%</span>
                    </div>
                </div>
                <div class="score-recommendations">
                    <h4>Recommendations</h4>
                    <ul>
                        <li>Continue paying bills on time to maintain good payment history</li>
                        <li>Keep credit utilization below 30%</li>
                        <li>Maintain a good mix of credit types</li>
                        <li>Review your credit report regularly for errors</li>
                    </ul>
                </div>
            </div>
        `;

    this.showModal("Credit Score Analysis", modalContent, "large");
  }

  showScoreAnalysis() {
    this.showScoreDetails();
  }

  handleRefresh(event) {
    event.preventDefault();
    const button = event.target;

    const originalText = button.textContent;
    button.innerHTML = `
            <span class="refresh-spinner">🔄</span>
            <span>Refreshing...</span>
        `;
    button.style.opacity = "0.8";
    button.disabled = true;

    const spinner = button.querySelector(".refresh-spinner");
    if (spinner) {
      spinner.style.animation = "spin 1s linear infinite";
    }

    setTimeout(() => {
      button.textContent = originalText;
      button.style.opacity = "1";
      button.disabled = false;

      this.showSuccessMessage("Credit score refreshed successfully! 📊");

      this.animateGauge();

      const now = new Date();
      const dateString = now
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
        })
        .replace(",", "")
        .replace(/(\d{2})\/(\w{3})\/(\d{2})/, "$1st $2 '$3");

      const scoreDesc = document.querySelector(".score-description");
      if (scoreDesc) {
        scoreDesc.innerHTML = `is your <span class="nb-text">NB</span> Score as of ${dateString}`;
      }
    }, 3000);
  }

  handleReportLink(linkText) {
    if (linkText.includes("View Your NB Report")) {
      this.showModal("NB Report Viewer", this.generateReportContent(), "large");
    } else if (linkText.includes("Download")) {
      this.handleDownload();
    }
  }

  generateReportContent() {
    return `
            <div class="report-preview">
                <div class="report-header">
                    <h3>NetBramha Credit Report Summary</h3>
                    <div class="report-date">Generated on ${new Date().toLocaleDateString()}</div>
                </div>
                
                <div class="report-sections">
                    <div class="report-section">
                        <h4> Credit Score Overview</h4>
                        <div class="score-summary">
                            <div class="score-item">
                                <span class="label">Current Score:</span>
                                <span class="value highlight">767</span>
                            </div>
                            <div class="score-item">
                                <span class="label">Score Range:</span>
                                <span class="value">300 - 900</span>
                            </div>
                            <div class="score-item">
                                <span class="label">Percentile:</span>
                                <span class="value">Top 30%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="report-section">
                        <h4> Account Summary</h4>
                        <div class="account-summary">
                            <div class="summary-grid">
                                <div class="summary-item">
                                    <div class="item-count">13</div>
                                    <div class="item-label">Total Accounts</div>
                                </div>
                                <div class="summary-item">
                                    <div class="item-count">8</div>
                                    <div class="item-label">Open Accounts</div>
                                </div>
                                <div class="summary-item">
                                    <div class="item-count">5</div>
                                    <div class="item-label">Closed Accounts</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="report-section">
                        <h4> Areas for Improvement</h4>
                        <div class="improvement-list">
                            <div class="improvement-item">
                                <span class="priority high">High</span>
                                <span class="description">Reduce credit utilization below 30%</span>
                            </div>
                            <div class="improvement-item">
                                <span class="priority medium">Medium</span>
                                <span class="description">Consider increasing credit mix diversity</span>
                            </div>
                            <div class="improvement-item">
                                <span class="priority low">Low</span>
                                <span class="description">Monitor credit inquiries</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  handleDownload() {
    this.showSuccessMessage("Preparing your report for download...");

    setTimeout(() => {
      // Create and trigger download
      const reportData = this.generateReportData();
      const blob = new Blob([reportData], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `NetBramha_Credit_Report_${
        new Date().toISOString().split("T")[0]
      }.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      this.showSuccessMessage("Report downloaded successfully! 📥");
    }, 2000);
  }

  generateReportData() {
    const currentDate = new Date().toLocaleDateString();
    return `
NETBRAMHA CREDIT REPORT
=======================
Generated on: ${currentDate}

CREDIT SCORE SUMMARY
--------------------
Current Score: 767
Score Range: 300 - 900
Percentile Ranking: Top 30% of all users
Last Updated: ${currentDate}

ACCOUNT OVERVIEW
----------------
Total Accounts: 13
- Open Accounts: 8
  * Open Credit Cards: 2
  * Open Loans: 6
- Closed Accounts: 5
  * Closed Credit Cards: 4
  * Closed Loans: 1

RECENT ACTIVITY
---------------
Total Disputes: 12
Total Enquiries (Last 3 years): 5

RECOMMENDATIONS
---------------
1. Continue paying bills on time to maintain good payment history
2. Keep credit utilization below 30%
3. Maintain a good mix of credit types
4. Review your credit report regularly for accuracy
5. Consider debt consolidation if needed

CONTACT INFORMATION
-------------------
For questions about this report, visit www.netbramha.com
Customer Support: support@netbramha.com

© 2024 NetBramha Studio LLP. All Rights Reserved.
        `.trim();
  }

  showDisputesInfo() {
    const modalContent = `
            <div class="disputes-info">
                <div class="info-header">
                    <h3>Understanding Credit Disputes</h3>
                    <p>Learn how to identify and resolve credit report errors effectively.</p>
                </div>
                
                <div class="info-sections">
                    <div class="info-section">
                        <h4> What are Credit Disputes?</h4>
                        <p>Credit disputes are formal requests to correct inaccurate, incomplete, or outdated information on your credit report. You have the right to dispute any information you believe is incorrect.</p>
                    </div>
                    
                    <div class="info-section">
                        <h4> Common Dispute Types</h4>
                        <ul class="dispute-types">
                            <li>Incorrect personal information</li>
                            <li>Accounts that don't belong to you</li>
                            <li>Incorrect payment status</li>
                            <li>Outdated negative information</li>
                            <li>Duplicate accounts</li>
                        </ul>
                    </div>
                    
                    <div class="info-section">
                        <h4>⚡ Quick Resolution Steps</h4>
                        <div class="resolution-steps">
                            <div class="step">
                                <div class="step-number">1</div>
                                <div class="step-content">
                                    <strong>Identify Issues</strong>
                                    <p>Review your credit report carefully</p>
                                </div>
                            </div>
                            <div class="step">
                                <div class="step-number">2</div>
                                <div class="step-content">
                                    <strong>Gather Evidence</strong>
                                    <p>Collect supporting documents</p>
                                </div>
                            </div>
                            <div class="step">
                                <div class="step-number">3</div>
                                <div class="step-content">
                                    <strong>File Dispute</strong>
                                    <p>Submit through NetBramha platform</p>
                                </div>
                            </div>
                            <div class="step">
                                <div class="step-number">4</div>
                                <div class="step-content">
                                    <strong>Track Progress</strong>
                                    <p>Monitor dispute status and updates</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    this.showModal("Credit Disputes Information", modalContent, "medium");
  }

  setupInteractiveElements() {
    // Add hover effects to all cards
    const cards = document.querySelectorAll(
      ".score-main-card, .nb-report-card, .accounts-main-card, .disputes-card, .enquiries-card, .where-you-stand-card, .score-history-card"
    );
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-2px)";
        card.style.boxShadow = "0 8px 25px -8px rgba(0,0,0,0.15)";
        card.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
        card.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.1)";
      });
    });

    // Add floating animation to score bars
    const barSegments = document.querySelectorAll(".bar-segment");
    barSegments.forEach((segment, index) => {
      segment.addEventListener("mouseenter", () => {
        segment.style.transform = "scaleY(1.05) translateY(-1px)";
        segment.style.zIndex = "10";
        segment.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
      });

      segment.addEventListener("mouseleave", () => {
        segment.style.transform = "scaleY(1) translateY(0)";
        segment.style.zIndex = "1";
        segment.style.boxShadow = "none";
      });
    });
  }

  showModal(title, content, size = "medium") {
    // Create modal overlay
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease-out;
            backdrop-filter: blur(4px);
        `;

    const modalWidth =
      size === "large" ? "90%" : size === "medium" ? "70%" : "50%";
    const maxWidth =
      size === "large" ? "900px" : size === "medium" ? "600px" : "400px";

    const modal = document.createElement("div");
    modal.style.cssText = `
            background: white;
            padding: 0;
            border-radius: 16px;
            width: ${modalWidth};
            max-width: ${maxWidth};
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px rgba(0,0,0,0.3);
            transform: translateY(30px) scale(0.95);
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;

    modal.innerHTML = `
            <div style="
                padding: 1.5rem 2rem;
                border-bottom: 1px solid #E2E8F0;
                background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
                border-radius: 16px 16px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <h3 style="margin: 0; color: #1E293B; font-weight: 600; font-size: 1.25rem;">${title}</h3>
                <button id="closeModal" style="
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #64748B;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                " onmouseover="this.style.background='#F1F5F9'; this.style.color='#1E293B'" 
                   onmouseout="this.style.background='none'; this.style.color='#64748B'">×</button>
            </div>
            <div style="
                padding: 2rem;
                color: #64748B;
                line-height: 1.6;
            ">${content}</div>
        `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Add modal-specific styles
    const modalStyles = document.createElement("style");
    modalStyles.textContent = `
            .score-details { font-family: inherit; }
            .score-header { text-align: center; margin-bottom: 2rem; }
            .score-large { font-size: 3rem; font-weight: 700; color: #1E293B; margin-bottom: 0.5rem; }
            .score-status { padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600; }
            .score-status.good { background: #DCFCE7; color: #16A34A; }
            .score-breakdown { margin-bottom: 2rem; }
            .breakdown-item { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
            .breakdown-label { min-width: 120px; font-weight: 500; color: #1E293B; }
            .breakdown-bar { flex: 1; height: 8px; background: #E2E8F0; border-radius: 4px; overflow: hidden; }
            .breakdown-fill { height: 100%; background: #0EA5E9; transition: width 0.8s ease; }
            .breakdown-score { font-weight: 600; color: #1E293B; min-width: 40px; text-align: right; }
            .score-recommendations h4 { color: #1E293B; margin-bottom: 1rem; font-weight: 600; }
            .score-recommendations ul { margin-left: 1.5rem; }
            .score-recommendations li { margin-bottom: 0.5rem; color: #64748B; }
            
            .report-preview { font-family: inherit; }
            .report-header { text-align: center; margin-bottom: 2rem; }
            .report-header h3 { color: #1E293B; margin-bottom: 0.5rem; }
            .report-date { color: #94A3B8; font-size: 0.9rem; }
            .report-sections { display: flex; flex-direction: column; gap: 1.5rem; }
            .report-section { background: #F8FAFC; padding: 1.5rem; border-radius: 8px; }
            .report-section h4 { color: #1E293B; margin-bottom: 1rem; font-weight: 600; }
            .score-summary { display: flex; flex-direction: column; gap: 0.75rem; }
            .score-item { display: flex; justify-content: space-between; }
            .label { color: #64748B; }
            .value { font-weight: 600; color: #1E293B; }
            .value.highlight { color: #16A34A; font-size: 1.1rem; }
            .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; }
            .summary-item { text-align: center; background: white; padding: 1rem; border-radius: 8px; }
            .item-count { font-size: 1.5rem; font-weight: 700; color: #1E293B; }
            .item-label { color: #64748B; font-size: 0.8rem; margin-top: 0.25rem; }
            .improvement-list { display: flex; flex-direction: column; gap: 0.75rem; }
            .improvement-item { display: flex; align-items: center; gap: 1rem; }
            .priority { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
            .priority.high { background: #FEE2E2; color: #DC2626; }
            .priority.medium { background: #FEF3C7; color: #D97706; }
            .priority.low { background: #DCFCE7; color: #16A34A; }
            
            .disputes-info { font-family: inherit; }
            .info-header { margin-bottom: 2rem; }
            .info-header h3 { color: #1E293B; margin-bottom: 0.5rem; }
            .info-sections { display: flex; flex-direction: column; gap: 1.5rem; }
            .info-section { background: #F8FAFC; padding: 1.5rem; border-radius: 8px; }
            .info-section h4 { color: #1E293B; margin-bottom: 1rem; font-weight: 600; }
            .dispute-types { margin: 0; padding-left: 1.5rem; }
            .dispute-types li { margin-bottom: 0.5rem; }
            .resolution-steps { display: flex; flex-direction: column; gap: 1rem; }
            .step { display: flex; align-items: flex-start; gap: 1rem; }
            .step-number { 
                background: #0EA5E9; 
                color: white; 
                width: 32px; 
                height: 32px; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-weight: 600; 
                flex-shrink: 0; 
            }
            .step-content strong { color: #1E293B; display: block; margin-bottom: 0.25rem; }
        `;
    document.head.appendChild(modalStyles);

    // Animate in
    setTimeout(() => {
      overlay.style.opacity = "1";
      modal.style.transform = "translateY(0) scale(1)";
    }, 10);

    // Close functionality
    const closeBtn = modal.querySelector("#closeModal");
    const closeModal = () => {
      overlay.style.opacity = "0";
      modal.style.transform = "translateY(30px) scale(0.95)";
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
          document.head.removeChild(modalStyles);
        }
      }, 300);
    };

    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });

    // ESC key to close
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", handleEsc);
      }
    };
    document.addEventListener("keydown", handleEsc);
  }

  showSuccessMessage(message) {
    const toast = document.createElement("div");
    toast.className = "success-toast";
    toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #16A34A 0%, #15803D 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(22, 163, 74, 0.3);
            z-index: 10001;
            font-weight: 500;
            transform: translateX(400px);
            transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            min-width: 200px;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 0.9rem;
        `;

    // Add icon based on message content
    let icon = "✅";
    if (message.includes("download")) icon = "📥";
    else if (message.includes("refresh")) icon = "🔄";
    else if (message.includes("filter")) icon = "🔍";
    else if (message.includes("score")) icon = "📊";

    toast.innerHTML = `
            <span style="font-size: 1.1rem;">${icon}</span>
            <span>${message}</span>
        `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.transform = "translateX(0)";
    }, 10);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      toast.style.transform = "translateX(400px)";
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 400);
    }, 3000);

    toast.addEventListener("click", () => {
      toast.style.transform = "translateX(400px)";
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 400);
    });
  }

  showLanguageSelector() {
    const languages = [
      { code: "en", name: "English", native: "English", flag: "🇺🇸" },
      { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
      { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
      { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
      { code: "bn", name: "Bengali", native: "বাংলা", flag: "🇮🇳" },
    ];

    let content = '<div class="language-selector">';
    content +=
      '<div class="selector-header"><h4>Choose Your Language</h4><p>Select your preferred language for the interface</p></div>';
    content += '<div class="language-grid">';

    languages.forEach((lang) => {
      const isActive = lang.code === "en";
      content += `
                <div class="language-option ${
                  isActive ? "active" : ""
                }" onclick="dashboard.selectLanguage('${lang.code}')">
                    <div class="lang-flag">${lang.flag}</div>
                    <div class="lang-names">
                        <div class="lang-name">${lang.name}</div>
                        <div class="lang-native">${lang.native}</div>
                    </div>
                    ${isActive ? '<div class="lang-check">✓</div>' : ""}
                </div>
            `;
    });

    content += "</div></div>";

    this.showModal("Language Selection", content, "medium");
  }

  selectLanguage(code) {
    this.showSuccessMessage(`Language changed to ${code.toUpperCase()}`);

    const modal = document.querySelector(".modal-overlay");
    if (modal) {
      modal.remove();
    }
  }

  showAccountMenu() {
    const menuItems = [
      {
        icon: "👤",
        title: "Profile Settings",
        description: "Update your personal information",
      },
      {
        icon: "📊",
        title: "Credit Monitoring",
        description: "Set up alerts and monitoring",
      },
      {
        icon: "🔔",
        title: "Notification Preferences",
        description: "Manage your notifications",
      },
      {
        icon: "🔒",
        title: "Security Settings",
        description: "Password and security options",
      },
      {
        icon: "❓",
        title: "Help & Support",
        description: "Get help and contact support",
      },
    ];

    let content = '<div class="account-menu">';
    content +=
      '<div class="menu-header"><h4>Account Settings</h4><p>Manage your account preferences and settings</p></div>';
    content += '<div class="menu-items">';

    menuItems.forEach((item) => {
      content += `
                <div class="menu-item" onclick="dashboard.handleAccountMenuClick('${item.title}')">
                    <div class="menu-icon">${item.icon}</div>
                    <div class="menu-content">
                        <div class="menu-title">${item.title}</div>
                        <div class="menu-description">${item.description}</div>
                    </div>
                    <div class="menu-arrow">→</div>
                </div>
            `;
    });

    content += "</div></div>";

    this.showModal("My Account", content, "medium");
  }

  handleAccountMenuClick(title) {
    this.showSuccessMessage(`Opening ${title}...`);

    const modal = document.querySelector(".modal-overlay");
    if (modal) {
      modal.remove();
    }
  }

  handleLogout() {
    const confirmContent = `
            <div class="logout-confirmation">
                <div class="confirmation-icon">🚪</div>
                <h4>Confirm Logout</h4>
                <p>Are you sure you want to logout from your NetBramha account?</p>
                <div class="confirmation-actions">
                    <button class="btn-cancel" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    <button class="btn-confirm" onclick="dashboard.confirmLogout()">Logout</button>
                </div>
            </div>
        `;

    this.showModal("Logout Confirmation", confirmContent, "small");
  }

  confirmLogout() {
    this.showSuccessMessage("Logging out...");

    const modal = document.querySelector(".modal-overlay");
    if (modal) {
      modal.remove();
    }

    setTimeout(() => {
      alert("Logout successful! You would be redirected to the login page.");
    }, 1500);
  }

  setupResponsiveFeatures() {
    this.handleResize();
  }

  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;

    if (wasMobile !== this.isMobile) {
      if (!this.isMobile && this.sidebarOpen) {
        this.toggleSidebar();
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.dashboard = new NetBramhaDashboard();
});

const animationStyles = document.createElement("style");
animationStyles.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .language-selector .selector-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .language-selector .selector-header h4 {
        color: #1E293B;
        margin-bottom: 0.5rem;
    }
    
    .language-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }
    
    .language-option {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border: 2px solid #E2E8F0;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .language-option:hover {
        border-color: #0EA5E9;
        background: #F8FAFC;
    }
    
    .language-option.active {
        border-color: #16A34A;
        background: #F0FDF4;
    }
    
    .lang-flag {
        font-size: 1.5rem;
    }
    
    .lang-names {
        flex: 1;
    }
    
    .lang-name {
        font-weight: 600;
        color: #1E293B;
    }
    
    .lang-native {
        color: #64748B;
        font-size: 0.9rem;
    }
    
    .lang-check {
        color: #16A34A;
        font-weight: bold;
        font-size: 1.2rem;
    }
    
    .account-menu .menu-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .account-menu .menu-header h4 {
        color: #1E293B;
        margin-bottom: 0.5rem;
    }
    
    .menu-items {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .menu-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .menu-item:hover {
        background: #F8FAFC;
        transform: translateX(4px);
    }
    
    .menu-icon {
        font-size: 1.5rem;
        width: 40px;
        text-align: center;
    }
    
    .menu-content {
        flex: 1;
    }
    
    .menu-title {
        font-weight: 600;
        color: #1E293B;
        margin-bottom: 0.25rem;
    }
    
    .menu-description {
        color: #64748B;
        font-size: 0.9rem;
    }
    
    .menu-arrow {
        color: #94A3B8;
        font-size: 1.2rem;
        transition: transform 0.2s ease;
    }
    
    .menu-item:hover .menu-arrow {
        transform: translateX(4px);
    }
    
    .logout-confirmation {
        text-align: center;
        padding: 1rem 0;
    }
    
    .confirmation-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .logout-confirmation h4 {
        color: #1E293B;
        margin-bottom: 1rem;
        font-weight: 600;
    }
    
    .logout-confirmation p {
        color: #64748B;
        margin-bottom: 2rem;
    }
    
    .confirmation-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
    
    .btn-cancel {
        background: #F1F5F9;
        color: #64748B;
        border: 1px solid #E2E8F0;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
    }
    
    .btn-cancel:hover {
        background: #E2E8F0;
    }
    
    .btn-confirm {
        background: #DC2626;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
    }
    
    .btn-confirm:hover {
        background: #B91C1C;
    }
`;

document.head.appendChild(animationStyles);
