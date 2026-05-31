export const RecommendationPanel = ({ recommendations }: { recommendations: string[] }) => (
  <section className="panel recommendations">
    <div className="section-heading">
      <div>
        <span className="eyebrow">Follow-up plan</span>
        <h3>Recommended actions</h3>
      </div>
    </div>
    <ul>
      {recommendations.map((recommendation) => (
        <li key={recommendation}>{recommendation}</li>
      ))}
    </ul>
  </section>
)
