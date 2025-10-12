import React, { useState, useEffect } from "react";
import { apiService, Account } from "../services/api";

interface InsuranceProduct {
  id: number;
  name: string;
  type: "life" | "health" | "auto" | "home" | "travel";
  description: string;
  coverage: string;
  premium: number;
  coverageAmount: number;
  term: string;
  features: string[];
  icon: string;
  color: string;
  isPopular?: boolean;
}

interface InsurancePolicy {
  id: number;
  productId: number;
  productName: string;
  policyNumber: string;
  accountId: number;
  accountNumber: string;
  startDate: string;
  endDate: string;
  premium: number;
  coverageAmount: number;
  status: "active" | "expired" | "cancelled" | "pending";
  nextPaymentDate: string;
  beneficiaries?: string[];
}

interface QuoteRequest {
  productType: "life" | "health" | "auto" | "home" | "travel";
  age: number;
  coverageAmount: number;
  term?: number;
  healthStatus?: "excellent" | "good" | "fair" | "poor";
  drivingRecord?: "clean" | "minor" | "major";
  propertyValue?: number;
  travelDestination?: string;
}

const InsuranceManagement: React.FC = () => {
  const [products, setProducts] = useState<InsuranceProduct[]>([]);
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "products" | "policies" | "quotes" | "claims"
  >("products");

  // Quote form state
  const [quoteRequest, setQuoteRequest] = useState<QuoteRequest>({
    productType: "life",
    age: 30,
    coverageAmount: 100000,
    term: 20,
    healthStatus: "good",
    drivingRecord: "clean",
    propertyValue: 300000,
    travelDestination: "",
  });
  const [quoteResult, setQuoteResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Mock data for demonstration
  const mockProducts: InsuranceProduct[] = [
    {
      id: 1,
      name: "Life Insurance Plus",
      type: "life",
      description:
        "Comprehensive life insurance with flexible terms and competitive rates",
      coverage: "Death benefit, terminal illness, accidental death",
      premium: 45,
      coverageAmount: 500000,
      term: "20-30 years",
      features: [
        "Term life coverage",
        "Accelerated death benefit",
        "No medical exam option",
        "Convertible to permanent",
      ],
      icon: "🛡️",
      color: "#28a745",
      isPopular: true,
    },
    {
      id: 2,
      name: "Health Shield Pro",
      type: "health",
      description:
        "Complete health coverage with low deductibles and extensive network",
      coverage: "Medical, dental, vision, prescription drugs",
      premium: 180,
      coverageAmount: 1000000,
      term: "Annual renewable",
      features: [
        "Low deductible",
        "Extensive provider network",
        "Prescription coverage",
        "Preventive care",
      ],
      icon: "🏥",
      color: "#007bff",
      isPopular: true,
    },
    {
      id: 3,
      name: "AutoGuard Complete",
      type: "auto",
      description:
        "Full coverage auto insurance with roadside assistance and rental car",
      coverage: "Liability, collision, comprehensive, uninsured motorist",
      premium: 120,
      coverageAmount: 100000,
      term: "6 months",
      features: [
        "Full coverage",
        "Roadside assistance",
        "Rental car coverage",
        "Accident forgiveness",
      ],
      icon: "🚗",
      color: "#ffc107",
    },
    {
      id: 4,
      name: "HomeProtect Premium",
      type: "home",
      description:
        "Comprehensive home insurance covering structure, contents, and liability",
      coverage:
        "Dwelling, personal property, liability, additional living expenses",
      premium: 95,
      coverageAmount: 400000,
      term: "Annual",
      features: [
        "Full replacement cost",
        "Personal liability",
        "Additional living expenses",
        "Natural disaster coverage",
      ],
      icon: "🏠",
      color: "#6f42c1",
    },
    {
      id: 5,
      name: "TravelSafe Global",
      type: "travel",
      description:
        "International travel insurance with medical coverage and trip protection",
      coverage:
        "Medical expenses, trip cancellation, baggage loss, emergency evacuation",
      premium: 25,
      coverageAmount: 50000,
      term: "Per trip",
      features: [
        "Medical coverage",
        "Trip cancellation",
        "Baggage protection",
        "24/7 assistance",
      ],
      icon: "✈️",
      color: "#17a2b8",
    },
  ];

  const mockPolicies: InsurancePolicy[] = [
    {
      id: 1,
      productId: 1,
      productName: "Life Insurance Plus",
      policyNumber: "POL-LIFE-001",
      accountId: 1,
      accountNumber: "ACC-001",
      startDate: "2023-01-15",
      endDate: "2043-01-15",
      premium: 45,
      coverageAmount: 500000,
      status: "active",
      nextPaymentDate: "2024-02-15",
      beneficiaries: ["Jane Smith", "John Smith Jr."],
    },
    {
      id: 2,
      productId: 3,
      productName: "AutoGuard Complete",
      policyNumber: "POL-AUTO-002",
      accountId: 1,
      accountNumber: "ACC-001",
      startDate: "2023-06-01",
      endDate: "2024-06-01",
      premium: 120,
      coverageAmount: 100000,
      status: "active",
      nextPaymentDate: "2024-02-01",
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const accountsData = await apiService.getAccounts();
      setAccounts(accountsData);

      // For now, use mock data
      setProducts(mockProducts);
      setPolicies(mockPolicies);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const calculateQuote = async () => {
    setIsCalculating(true);
    try {
      // Simulate quote calculation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let basePremium = 0;
      let coverageMultiplier = 1;

      switch (quoteRequest.productType) {
        case "life":
          basePremium = 30;
          coverageMultiplier = (quoteRequest.coverageAmount || 0) / 100000;
          if ((quoteRequest.age || 0) > 50) coverageMultiplier *= 1.5;
          if (quoteRequest.healthStatus === "poor") coverageMultiplier *= 2;
          break;
        case "health":
          basePremium = 150;
          coverageMultiplier = (quoteRequest.coverageAmount || 0) / 1000000;
          if (quoteRequest.healthStatus === "poor") coverageMultiplier *= 1.8;
          break;
        case "auto":
          basePremium = 80;
          coverageMultiplier = (quoteRequest.coverageAmount || 0) / 100000;
          if (quoteRequest.drivingRecord === "major") coverageMultiplier *= 2.5;
          else if (quoteRequest.drivingRecord === "minor")
            coverageMultiplier *= 1.3;
          break;
        case "home":
          basePremium = 60;
          coverageMultiplier = (quoteRequest.propertyValue || 0) / 300000;
          break;
        case "travel":
          basePremium = 20;
          coverageMultiplier = (quoteRequest.coverageAmount || 0) / 50000;
          break;
      }

      const calculatedPremium = Math.round(basePremium * coverageMultiplier);

      setQuoteResult({
        productType: quoteRequest.productType,
        coverageAmount: quoteRequest.coverageAmount,
        monthlyPremium: calculatedPremium,
        annualPremium: calculatedPremium * 12,
        term: quoteRequest.term || "Annual",
        savings: Math.round(calculatedPremium * 0.1), // 10% savings
        features: getProductFeatures(quoteRequest.productType),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Quote calculation failed");
    } finally {
      setIsCalculating(false);
    }
  };

  const getProductFeatures = (type: string) => {
    const features = {
      life: [
        "Death benefit",
        "Terminal illness coverage",
        "Accelerated benefits",
        "No medical exam option",
      ],
      health: [
        "Medical coverage",
        "Prescription drugs",
        "Preventive care",
        "Mental health",
      ],
      auto: [
        "Liability coverage",
        "Collision coverage",
        "Comprehensive coverage",
        "Roadside assistance",
      ],
      home: [
        "Dwelling coverage",
        "Personal property",
        "Liability protection",
        "Additional living expenses",
      ],
      travel: [
        "Medical expenses",
        "Trip cancellation",
        "Baggage protection",
        "Emergency evacuation",
      ],
    };
    return features[type as keyof typeof features] || [];
  };

  const purchasePolicy = async (productId: number) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const newPolicy: InsurancePolicy = {
        id: policies.length + 1,
        productId: product.id,
        productName: product.name,
        policyNumber: `POL-${product.type.toUpperCase()}-${Date.now()}`,
        accountId: accounts[0]?.id || 1,
        accountNumber: accounts[0]?.accountNumber || "ACC-001",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        premium: product.premium,
        coverageAmount: product.coverageAmount,
        status: "pending",
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      };

      setPolicies([...policies, newPolicy]);
      alert(
        `Policy application submitted! Policy Number: ${newPolicy.policyNumber}`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to purchase policy"
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#28a745";
      case "pending":
        return "#ffc107";
      case "expired":
        return "#dc3545";
      case "cancelled":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "life":
        return "🛡️";
      case "health":
        return "🏥";
      case "auto":
        return "🚗";
      case "home":
        return "🏠";
      case "travel":
        return "✈️";
      default:
        return "📋";
    }
  };

  if (loading)
    return <div className="loading">Loading insurance products...</div>;

  return (
    <div className="main-content">
      <h2>🛡️ Insurance Management</h2>

      {error && <div className="error">Error: {error}</div>}

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
          data-icon="🛡️"
        >
          <span>Products</span>
        </button>
        <button
          className={`tab-button ${activeTab === "policies" ? "active" : ""}`}
          onClick={() => setActiveTab("policies")}
          data-icon="📋"
        >
          <span>My Policies</span>
        </button>
        <button
          className={`tab-button ${activeTab === "quotes" ? "active" : ""}`}
          onClick={() => setActiveTab("quotes")}
          data-icon="💰"
        >
          <span>Get Quote</span>
        </button>
        <button
          className={`tab-button ${activeTab === "claims" ? "active" : ""}`}
          onClick={() => setActiveTab("claims")}
          data-icon="📝"
        >
          <span>Claims</span>
        </button>
      </div>

      {activeTab === "products" && (
        <div className="products-container">
          <h3>Insurance Products</h3>
          <div className="products-grid">
            {products.map((product) => (
              <div
                key={product.id}
                className={`product-card ${product.isPopular ? "popular" : ""}`}
              >
                {product.isPopular && (
                  <div className="popular-badge">Most Popular</div>
                )}
                <div className="product-header">
                  <div
                    className="product-icon"
                    style={{ backgroundColor: product.color }}
                  >
                    {product.icon}
                  </div>
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="product-type">{product.type.toUpperCase()}</p>
                  </div>
                </div>

                <div className="product-description">
                  <p>{product.description}</p>
                </div>

                <div className="product-coverage">
                  <h5>Coverage Includes:</h5>
                  <p>{product.coverage}</p>
                </div>

                <div className="product-features">
                  <h5>Key Features:</h5>
                  <ul>
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="product-pricing">
                  <div className="premium">
                    <span className="amount">${product.premium}</span>
                    <span className="period">/month</span>
                  </div>
                  <div className="coverage">
                    <span className="label">Coverage:</span>
                    <span className="value">
                      ${product.coverageAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => purchasePolicy(product.id)}
                >
                  Get Quote & Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "policies" && (
        <div className="policies-container">
          <h3>My Insurance Policies</h3>
          {policies.length === 0 ? (
            <div className="no-policies">
              <p>No policies found. Browse our products to get started!</p>
            </div>
          ) : (
            <div className="policies-grid">
              {policies.map((policy) => (
                <div key={policy.id} className="policy-card">
                  <div className="policy-header">
                    <div className="policy-icon">
                      {getTypeIcon(
                        products.find((p) => p.id === policy.productId)?.type ||
                          ""
                      )}
                    </div>
                    <div className="policy-info">
                      <h4>{policy.productName}</h4>
                      <p className="policy-number">{policy.policyNumber}</p>
                    </div>
                    <div className="policy-status">
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(policy.status),
                        }}
                      >
                        {policy.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="policy-details">
                    <div className="detail-row">
                      <span className="label">Coverage Amount:</span>
                      <span className="value">
                        ${policy.coverageAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Monthly Premium:</span>
                      <span className="value">${policy.premium}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Policy Period:</span>
                      <span className="value">
                        {policy.startDate} - {policy.endDate}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Next Payment:</span>
                      <span className="value">
                        {new Date(policy.nextPaymentDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {policy.beneficiaries && policy.beneficiaries.length > 0 && (
                    <div className="beneficiaries">
                      <h5>Beneficiaries:</h5>
                      <ul>
                        {policy.beneficiaries.map((beneficiary, index) => (
                          <li key={index}>{beneficiary}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="policy-actions">
                    <button className="btn btn-secondary">View Details</button>
                    <button className="btn btn-primary">Make Payment</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "quotes" && (
        <div className="quotes-container">
          <h3>Get Insurance Quote</h3>
          <div className="quote-form">
            <div className="form-row">
              <div className="form-group">
                <label>Insurance Type</label>
                <select
                  value={quoteRequest.productType}
                  onChange={(e) =>
                    setQuoteRequest({
                      ...quoteRequest,
                      productType: e.target.value as any,
                    })
                  }
                  required
                >
                  <option value="life">Life Insurance</option>
                  <option value="health">Health Insurance</option>
                  <option value="auto">Auto Insurance</option>
                  <option value="home">Home Insurance</option>
                  <option value="travel">Travel Insurance</option>
                </select>
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  value={quoteRequest.age}
                  onChange={(e) =>
                    setQuoteRequest({
                      ...quoteRequest,
                      age: parseInt(e.target.value),
                    })
                  }
                  min="18"
                  max="80"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Coverage Amount</label>
              <input
                type="number"
                value={quoteRequest.coverageAmount}
                onChange={(e) =>
                  setQuoteRequest({
                    ...quoteRequest,
                    coverageAmount: parseInt(e.target.value),
                  })
                }
                min="10000"
                step="10000"
                required
              />
            </div>

            {quoteRequest.productType === "life" && (
              <div className="form-group">
                <label>Term (years)</label>
                <select
                  value={quoteRequest.term || 20}
                  onChange={(e) =>
                    setQuoteRequest({
                      ...quoteRequest,
                      term: parseInt(e.target.value),
                    })
                  }
                >
                  <option value={10}>10 years</option>
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={30}>30 years</option>
                </select>
              </div>
            )}

            {quoteRequest.productType === "health" && (
              <div className="form-group">
                <label>Health Status</label>
                <select
                  value={quoteRequest.healthStatus || "good"}
                  onChange={(e) =>
                    setQuoteRequest({
                      ...quoteRequest,
                      healthStatus: e.target.value as any,
                    })
                  }
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            )}

            {quoteRequest.productType === "auto" && (
              <div className="form-group">
                <label>Driving Record</label>
                <select
                  value={quoteRequest.drivingRecord || "clean"}
                  onChange={(e) =>
                    setQuoteRequest({
                      ...quoteRequest,
                      drivingRecord: e.target.value as any,
                    })
                  }
                >
                  <option value="clean">Clean</option>
                  <option value="minor">Minor violations</option>
                  <option value="major">Major violations</option>
                </select>
              </div>
            )}

            {quoteRequest.productType === "home" && (
              <div className="form-group">
                <label>Property Value</label>
                <input
                  type="number"
                  value={quoteRequest.propertyValue || 300000}
                  onChange={(e) =>
                    setQuoteRequest({
                      ...quoteRequest,
                      propertyValue: parseInt(e.target.value),
                    })
                  }
                  min="100000"
                  step="10000"
                />
              </div>
            )}

            <button
              className="btn btn-primary"
              onClick={calculateQuote}
              disabled={isCalculating}
            >
              {isCalculating ? "Calculating Quote..." : "Get Quote"}
            </button>

            {quoteResult && (
              <div className="quote-result">
                <h4>Your Quote</h4>
                <div className="quote-details">
                  <div className="quote-row">
                    <span>Insurance Type:</span>
                    <span>{quoteResult.productType.toUpperCase()}</span>
                  </div>
                  <div className="quote-row">
                    <span>Coverage Amount:</span>
                    <span>${quoteResult.coverageAmount.toLocaleString()}</span>
                  </div>
                  <div className="quote-row">
                    <span>Monthly Premium:</span>
                    <span>${quoteResult.monthlyPremium}</span>
                  </div>
                  <div className="quote-row">
                    <span>Annual Premium:</span>
                    <span>${quoteResult.annualPremium}</span>
                  </div>
                  <div className="quote-row savings">
                    <span>You Save:</span>
                    <span>${quoteResult.savings}/month</span>
                  </div>
                </div>
                <div className="quote-features">
                  <h5>Coverage Includes:</h5>
                  <ul>
                    {quoteResult.features.map(
                      (feature: string, index: number) => (
                        <li key={index}>{feature}</li>
                      )
                    )}
                  </ul>
                </div>
                <button className="btn btn-success">Apply Now</button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "claims" && (
        <div className="claims-container">
          <h3>Insurance Claims</h3>
          <div className="claims-actions">
            <button className="btn btn-primary">File New Claim</button>
            <button className="btn btn-secondary">View Claim Status</button>
          </div>
          <div className="claims-info">
            <h4>How to File a Claim</h4>
            <ol>
              <li>Contact us immediately after an incident</li>
              <li>Gather all relevant documentation</li>
              <li>Complete the claim form online</li>
              <li>Submit supporting documents</li>
              <li>Track your claim status</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceManagement;
