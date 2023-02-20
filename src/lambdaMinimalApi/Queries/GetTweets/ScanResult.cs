namespace lambdaMinimalApi.Queries.GetTweets
{
    public class ScanResult
    {
        public int Count { get; set; }
        public int ScannedCount { get; set; }
        public List<Tweets> Items { get; set; }
    }
}