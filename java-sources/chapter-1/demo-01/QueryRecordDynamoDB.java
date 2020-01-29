import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.QueryOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;

public class QueryRecordDynamoDB {
    static final String TABLE_NAME = "orders";

    public static void main(String... args) {
        // The profile name you have given when configuring aws credentials in command line
        ProfileCredentialsProvider profileCredentialsProvider = new ProfileCredentialsProvider("admin");
        final AmazonDynamoDB ddb = AmazonDynamoDBClientBuilder.standard()
                                                              .withCredentials(profileCredentialsProvider)
                                                              .build();

        DynamoDB dynamoDB = new DynamoDB(ddb);
        Table table = dynamoDB.getTable(TABLE_NAME);
        QuerySpec spec = new QuerySpec()
                .withKeyConditionExpression("user_id = :id and order_time = :time")
                .withValueMap(new ValueMap()
                        .withString(":id", "789")
                .withString(":time", "2019-02-29 00:00:00"));
        
        ItemCollection<QueryOutcome> items = table.query(spec);
        items.forEach(item -> {
            System.out.println(item);
        });
    }

}
