import React, { useState, useEffect } from "react";
import { apiService, Account } from "../services/api";

interface LoanApplication {
  id: number;
  loanType: "personal" | "car" | "business";
  amount: number;
  term: number; // in months
  interestRate: number;
  monthlyPayment: number;
  totalAmount: number;
  status: "pending" | "approved" | "rejected" | "active" | "completed";
  applicationDate: string;
  approvalDate?: string;
  startDate?: string;
  endDate?: string;
  purpose: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  annualIncome: number;
  employmentStatus: string;
  creditScore?: number;
  collateral?: string;
  businessType?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleValue?: number;
}

interface LoanProduct {
  id: number;
  name: string;
  type: "personal" | "car" | "business";
  description: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  interestRate: number;
  features: string[];
  requirements: string[];
  icon: string;
  color: string;
  isPopular?: boolean;
}

const LoanManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(
    null
  );
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    loanType: "personal" as "personal" | "car" | "business",
    amount: 0,
    term: 12,
    purpose: "",
    annualIncome: 0,
    employmentStatus: "employed",
    creditScore: 0,
    collateral: "",
    businessType: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: new Date().getFullYear(),
    vehicleValue: 0,
  });

  const loanProducts: LoanProduct[] = [
    {
      id: 1,
      name: "Personal Loan Plus",
      type: "personal",
      description:
        "Flexible personal loans for debt consolidation, home improvements, and major purchases",
      minAmount: 1000,
      maxAmount: 50000,
      minTerm: 6,
      maxTerm: 60,
      interestRate: 8.5,
      features: [
        "No collateral required",
        "Fast approval process",
        "Flexible repayment terms",
        "Competitive interest rates",
        "Online application",
      ],
      requirements: [
        "Minimum annual income: $25,000",
        "Good credit score (650+)",
        "Employment verification",
        "Bank account with us",
      ],
      icon: "💰",
      color: "#ffd700",
      isPopular: true,
    },
    {
      id: 2,
      name: "Auto Finance Pro",
      type: "car",
      description:
        "Competitive auto loans for new and used vehicles with flexible terms",
      minAmount: 5000,
      maxAmount: 100000,
      minTerm: 12,
      maxTerm: 84,
      interestRate: 6.9,
      features: [
        "New and used vehicles",
        "Low down payment options",
        "GAP insurance available",
        "Extended warranty options",
        "Quick pre-approval",
      ],
      requirements: [
        "Vehicle as collateral",
        "Valid driver's license",
        "Insurance coverage",
        "Income verification",
      ],
      icon: "🚗",
      color: "#ffd700",
      isPopular: true,
    },
    {
      id: 3,
      name: "Business Capital",
      type: "business",
      description:
        "Working capital and equipment financing for growing businesses",
      minAmount: 10000,
      maxAmount: 500000,
      minTerm: 12,
      maxTerm: 120,
      interestRate: 7.5,
      features: [
        "Working capital loans",
        "Equipment financing",
        "Business line of credit",
        "SBA loan assistance",
        "Dedicated business advisor",
      ],
      requirements: [
        "Business registration",
        "Financial statements",
        "Business plan",
        "Collateral (if required)",
      ],
      icon: "🏢",
      color: "#ffd700",
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const accountsData = await apiService.getAccounts();
      setAccounts(accountsData);

      // Mock loan applications data
      const mockApplications: LoanApplication[] = [
        {
          id: 1,
          loanType: "personal",
          amount: 15000,
          term: 36,
          interestRate: 8.5,
          monthlyPayment: 475.5,
          totalAmount: 17118,
          status: "active",
          applicationDate: "2024-01-15",
          approvalDate: "2024-01-16",
          startDate: "2024-01-20",
          endDate: "2027-01-20",
          purpose: "Debt consolidation",
          applicantName: "John Smith",
          applicantEmail: "john.smith@email.com",
          applicantPhone: "+1-555-0123",
          annualIncome: 75000,
          employmentStatus: "employed",
          creditScore: 720,
        },
        {
          id: 2,
          loanType: "car",
          amount: 25000,
          term: 60,
          interestRate: 6.9,
          monthlyPayment: 495.2,
          totalAmount: 29712,
          status: "pending",
          applicationDate: "2024-01-20",
          purpose: "Vehicle purchase",
          applicantName: "Sarah Johnson",
          applicantEmail: "sarah.j@email.com",
          applicantPhone: "+1-555-0456",
          annualIncome: 65000,
          employmentStatus: "employed",
          vehicleMake: "Toyota",
          vehicleModel: "Camry",
          vehicleYear: 2024,
          vehicleValue: 28000,
        },
        {
          id: 3,
          loanType: "business",
          amount: 100000,
          term: 84,
          interestRate: 7.5,
          monthlyPayment: 1450.8,
          totalAmount: 121867,
          status: "approved",
          applicationDate: "2024-01-10",
          approvalDate: "2024-01-18",
          purpose: "Equipment purchase",
          applicantName: "Mike Wilson",
          applicantEmail: "mike.w@business.com",
          applicantPhone: "+1-555-0789",
          annualIncome: 150000,
          employmentStatus: "self-employed",
          businessType: "Manufacturing",
        },
      ];

      setApplications(mockApplications);
    } catch (error) {
      console.error("Error loading loan data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateLoan = (
    amount: number,
    term: number,
    interestRate: number
  ) => {
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) /
      (Math.pow(1 + monthlyRate, term) - 1);
    const totalAmount = monthlyPayment * term;

    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
    };
  };

  const handleProductSelect = (product: LoanProduct) => {
    setSelectedProduct(product);
    setApplicationForm((prev) => ({
      ...prev,
      loanType: product.type,
      amount: product.minAmount,
      term: product.minTerm,
    }));
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const product = loanProducts.find(
      (p) => p.type === applicationForm.loanType
    );
    if (!product) return;

    const { monthlyPayment, totalAmount } = calculateLoan(
      applicationForm.amount,
      applicationForm.term,
      product.interestRate
    );

    const newApplication: LoanApplication = {
      id: applications.length + 1,
      loanType: applicationForm.loanType,
      amount: applicationForm.amount,
      term: applicationForm.term,
      interestRate: product.interestRate,
      monthlyPayment,
      totalAmount,
      status: "pending",
      applicationDate: new Date().toISOString(),
      purpose: applicationForm.purpose,
      applicantName: "Current User", // In real app, get from user context
      applicantEmail: "user@email.com",
      applicantPhone: "+1-555-0000",
      annualIncome: applicationForm.annualIncome,
      employmentStatus: applicationForm.employmentStatus,
      creditScore: applicationForm.creditScore,
      collateral: applicationForm.collateral,
      businessType: applicationForm.businessType,
      vehicleMake: applicationForm.vehicleMake,
      vehicleModel: applicationForm.vehicleModel,
      vehicleYear: applicationForm.vehicleYear,
      vehicleValue: applicationForm.vehicleValue,
    };

    setApplications((prev) => [newApplication, ...prev]);
    setShowApplicationForm(false);
    setSelectedProduct(null);

    // Reset form
    setApplicationForm({
      loanType: "personal",
      amount: 0,
      term: 12,
      purpose: "",
      annualIncome: 0,
      employmentStatus: "employed",
      creditScore: 0,
      collateral: "",
      businessType: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: new Date().getFullYear(),
      vehicleValue: 0,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "danger";
      case "completed":
        return "info";
      default:
        return "secondary";
    }
  };

  if (loading) return <div className="loading">Loading loan management...</div>;

  return (
    <div className="main-content">
      <div className="loan-header">
        <h1>🏦 Loan Management</h1>
        <p>Personal, Car, and Business Loans</p>
      </div>

      {/* Loan Navigation Tabs */}
      <div className="loan-tabs">
        <button
          className={`loan-tab ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          📋 Loan Products
        </button>
        <button
          className={`loan-tab ${activeTab === "applications" ? "active" : ""}`}
          onClick={() => setActiveTab("applications")}
        >
          📝 Applications
        </button>
        <button
          className={`loan-tab ${activeTab === "calculator" ? "active" : ""}`}
          onClick={() => setActiveTab("calculator")}
        >
          🧮 Calculator
        </button>
        <button
          className={`loan-tab ${activeTab === "my-loans" ? "active" : ""}`}
          onClick={() => setActiveTab("my-loans")}
        >
          💳 My Loans
        </button>
      </div>

      {/* Loan Products Tab */}
      {activeTab === "products" && (
        <div className="loan-products">
          <div className="products-grid">
            {loanProducts.map((product) => (
              <div
                key={product.id}
                className={`product-card ${product.isPopular ? "popular" : ""}`}
              >
                {product.isPopular && (
                  <div className="popular-badge">MOST POPULAR</div>
                )}
                <div className="product-header">
                  <div
                    className="product-icon"
                    style={{ backgroundColor: product.color }}
                  >
                    {product.icon}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-type">{product.type.toUpperCase()}</p>
                  </div>
                </div>
                <p className="product-description">{product.description}</p>
                <div className="product-details">
                  <div className="detail-item">
                    <span className="detail-label">Amount Range:</span>
                    <span className="detail-value">
                      {formatCurrency(product.minAmount)} -{" "}
                      {formatCurrency(product.maxAmount)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Term:</span>
                    <span className="detail-value">
                      {product.minTerm} - {product.maxTerm} months
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Interest Rate:</span>
                    <span className="detail-value">
                      {product.interestRate}% APR
                    </span>
                  </div>
                </div>
                <div className="product-features">
                  <h4>Key Features:</h4>
                  <ul>
                    {product.features.slice(0, 3).map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => handleProductSelect(product)}
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <div className="loan-applications">
          <div className="section-header">
            <h2>Loan Applications</h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowApplicationForm(true)}
            >
              New Application
            </button>
          </div>

          <div className="applications-table-container">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Application</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Term</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td>
                      <div className="application-info">
                        <strong>#{application.id}</strong>
                        <br />
                        <small>{application.purpose}</small>
                      </div>
                    </td>
                    <td>
                      <span className="loan-type-badge">
                        {application.loanType.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <strong>{formatCurrency(application.amount)}</strong>
                      <br />
                      <small>{application.term} months</small>
                    </td>
                    <td>
                      <div>
                        <strong>{application.term} months</strong>
                        <br />
                        <small>{application.interestRate}% APR</small>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {application.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{formatDate(application.applicationDate)}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-sm btn-info">View</button>
                        {application.status === "pending" && (
                          <button className="btn btn-sm btn-warning">
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Calculator Tab */}
      {activeTab === "calculator" && (
        <div className="loan-calculator">
          <div className="calculator-header">
            <h2>Loan Calculator</h2>
            <p>Calculate your monthly payments and total cost</p>
          </div>

          <div className="calculator-content">
            <div className="calculator-form">
              <div className="form-group">
                <label>Loan Type</label>
                <select
                  className="form-control"
                  value={applicationForm.loanType}
                  onChange={(e) =>
                    setApplicationForm((prev) => ({
                      ...prev,
                      loanType: e.target.value as
                        | "personal"
                        | "car"
                        | "business",
                    }))
                  }
                >
                  <option value="personal">Personal Loan</option>
                  <option value="car">Car Loan</option>
                  <option value="business">Business Loan</option>
                </select>
              </div>

              <div className="form-group">
                <label>Loan Amount</label>
                <input
                  type="number"
                  className="form-control"
                  value={applicationForm.amount}
                  onChange={(e) =>
                    setApplicationForm((prev) => ({
                      ...prev,
                      amount: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="Enter loan amount"
                />
              </div>

              <div className="form-group">
                <label>Loan Term (months)</label>
                <input
                  type="number"
                  className="form-control"
                  value={applicationForm.term}
                  onChange={(e) =>
                    setApplicationForm((prev) => ({
                      ...prev,
                      term: parseInt(e.target.value) || 12,
                    }))
                  }
                  placeholder="Enter loan term"
                />
              </div>

              <div className="form-group">
                <label>Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={
                    applicationForm.loanType === "personal"
                      ? 8.5
                      : applicationForm.loanType === "car"
                      ? 6.9
                      : 7.5
                  }
                  readOnly
                />
              </div>
            </div>

            <div className="calculator-results">
              <h3>Payment Summary</h3>
              {applicationForm.amount > 0 && applicationForm.term > 0 && (
                <div className="results-card">
                  <div className="result-item">
                    <span className="result-label">Monthly Payment:</span>
                    <span className="result-value">
                      {formatCurrency(
                        calculateLoan(
                          applicationForm.amount,
                          applicationForm.term,
                          applicationForm.loanType === "personal"
                            ? 8.5
                            : applicationForm.loanType === "car"
                            ? 6.9
                            : 7.5
                        ).monthlyPayment
                      )}
                    </span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Total Amount:</span>
                    <span className="result-value">
                      {formatCurrency(
                        calculateLoan(
                          applicationForm.amount,
                          applicationForm.term,
                          applicationForm.loanType === "personal"
                            ? 8.5
                            : applicationForm.loanType === "car"
                            ? 6.9
                            : 7.5
                        ).totalAmount
                      )}
                    </span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Total Interest:</span>
                    <span className="result-value">
                      {formatCurrency(
                        calculateLoan(
                          applicationForm.amount,
                          applicationForm.term,
                          applicationForm.loanType === "personal"
                            ? 8.5
                            : applicationForm.loanType === "car"
                            ? 6.9
                            : 7.5
                        ).totalAmount - applicationForm.amount
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* My Loans Tab */}
      {activeTab === "my-loans" && (
        <div className="my-loans">
          <div className="section-header">
            <h2>My Active Loans</h2>
          </div>

          <div className="loans-grid">
            {applications
              .filter((app) => app.status === "active")
              .map((loan) => (
                <div key={loan.id} className="loan-card">
                  <div className="loan-header">
                    <div className="loan-icon">
                      {loan.loanType === "personal"
                        ? "💰"
                        : loan.loanType === "car"
                        ? "🚗"
                        : "🏢"}
                    </div>
                    <div className="loan-info">
                      <h3>{loan.loanType.toUpperCase()} Loan</h3>
                      <p>#{loan.id}</p>
                    </div>
                  </div>

                  <div className="loan-details">
                    <div className="detail-row">
                      <span>Original Amount:</span>
                      <span>{formatCurrency(loan.amount)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Monthly Payment:</span>
                      <span>{formatCurrency(loan.monthlyPayment)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Interest Rate:</span>
                      <span>{loan.interestRate}% APR</span>
                    </div>
                    <div className="detail-row">
                      <span>Remaining Term:</span>
                      <span>{loan.term} months</span>
                    </div>
                    <div className="detail-row">
                      <span>Next Payment:</span>
                      <span>{formatDate(loan.startDate || "")}</span>
                    </div>
                  </div>

                  <div className="loan-actions">
                    <button className="btn btn-primary">Make Payment</button>
                    <button className="btn btn-secondary">View Details</button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Loan Application</h2>
              <button
                className="modal-close"
                onClick={() => setShowApplicationForm(false)}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleApplicationSubmit}
              className="application-form"
            >
              <div className="form-section">
                <h3>Loan Details</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Loan Type</label>
                    <select
                      className="form-control"
                      value={applicationForm.loanType}
                      onChange={(e) =>
                        setApplicationForm((prev) => ({
                          ...prev,
                          loanType: e.target.value as
                            | "personal"
                            | "car"
                            | "business",
                        }))
                      }
                    >
                      <option value="personal">Personal Loan</option>
                      <option value="car">Car Loan</option>
                      <option value="business">Business Loan</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Loan Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      value={applicationForm.amount}
                      onChange={(e) =>
                        setApplicationForm((prev) => ({
                          ...prev,
                          amount: parseFloat(e.target.value) || 0,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Loan Term (months)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={applicationForm.term}
                      onChange={(e) =>
                        setApplicationForm((prev) => ({
                          ...prev,
                          term: parseInt(e.target.value) || 12,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Purpose</label>
                    <input
                      type="text"
                      className="form-control"
                      value={applicationForm.purpose}
                      onChange={(e) =>
                        setApplicationForm((prev) => ({
                          ...prev,
                          purpose: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Annual Income</label>
                    <input
                      type="number"
                      className="form-control"
                      value={applicationForm.annualIncome}
                      onChange={(e) =>
                        setApplicationForm((prev) => ({
                          ...prev,
                          annualIncome: parseFloat(e.target.value) || 0,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Employment Status</label>
                    <select
                      className="form-control"
                      value={applicationForm.employmentStatus}
                      onChange={(e) =>
                        setApplicationForm((prev) => ({
                          ...prev,
                          employmentStatus: e.target.value,
                        }))
                      }
                    >
                      <option value="employed">Employed</option>
                      <option value="self-employed">Self-Employed</option>
                      <option value="unemployed">Unemployed</option>
                      <option value="retired">Retired</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Credit Score (optional)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={applicationForm.creditScore}
                    onChange={(e) =>
                      setApplicationForm((prev) => ({
                        ...prev,
                        creditScore: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>

              {applicationForm.loanType === "car" && (
                <div className="form-section">
                  <h3>Vehicle Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Make</label>
                      <input
                        type="text"
                        className="form-control"
                        value={applicationForm.vehicleMake}
                        onChange={(e) =>
                          setApplicationForm((prev) => ({
                            ...prev,
                            vehicleMake: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Model</label>
                      <input
                        type="text"
                        className="form-control"
                        value={applicationForm.vehicleModel}
                        onChange={(e) =>
                          setApplicationForm((prev) => ({
                            ...prev,
                            vehicleModel: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Year</label>
                      <input
                        type="number"
                        className="form-control"
                        value={applicationForm.vehicleYear}
                        onChange={(e) =>
                          setApplicationForm((prev) => ({
                            ...prev,
                            vehicleYear:
                              parseInt(e.target.value) ||
                              new Date().getFullYear(),
                          }))
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Vehicle Value</label>
                      <input
                        type="number"
                        className="form-control"
                        value={applicationForm.vehicleValue}
                        onChange={(e) =>
                          setApplicationForm((prev) => ({
                            ...prev,
                            vehicleValue: parseFloat(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {applicationForm.loanType === "business" && (
                <div className="form-section">
                  <h3>Business Information</h3>
                  <div className="form-group">
                    <label>Business Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={applicationForm.businessType}
                      onChange={(e) =>
                        setApplicationForm((prev) => ({
                          ...prev,
                          businessType: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowApplicationForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanManagement;
